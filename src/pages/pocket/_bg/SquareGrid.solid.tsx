/** @jsxImportSource solid-js */
import "./SquareGrid.css";
import { createEffect, createMemo, onCleanup, onMount } from "solid-js";

interface SquareGridBackgroundProps {
  xSpeed?: number;
  ySpeed?: number;
  gridSize?: number;
  startXOffset?: number;
  startYOffset?: number;
}

interface GridSize {
  width: number;
  height: number;
}

// 将任意数值规整到 [0, size) 范围内，方便循环动画保持稳定。
const normalizeOffset = (value: number, size: number) => {
  if (size <= 0) return 0;
  return ((value % size) + size) % size;
};

const AnimatedSquareGridBackground = (props: SquareGridBackgroundProps) => {
  // 使用 memo 包装参数，既能保留默认值，也能让外部动态修改参数时立即生效。
  const xSpeed = createMemo(() => props.xSpeed ?? 24);
  const ySpeed = createMemo(() => props.ySpeed ?? 16);
  const gridSize = createMemo(() => Math.max(1, props.gridSize ?? 40));
  const startXOffset = createMemo(() => props.startXOffset ?? 0);
  const startYOffset = createMemo(() => props.startYOffset ?? 0);

  let container!: HTMLDivElement;
  let animationId = 0;
  let resizeObserver: ResizeObserver | undefined;

  // 记录容器尺寸。背景尺寸变化时，需要重建线条数量，避免出现空白区域。
  let currentSize: GridSize = { width: 0, height: 0 };

  // 两个相互独立的相位值：
  // - phaseX 控制竖线整体的水平偏移，对应 X 方向速度；
  // - phaseY 控制横线整体的垂直偏移，对应 Y 方向速度。
  let phaseX = 0;
  let phaseY = 0;
  let lastTimestamp = 0;

  const applyStartOffsets = () => {
    // 起始偏移会被规整到 [0, gridSize) 区间，确保循环网格在任意输入值下都连续。
    // 这个能力在某一方向速度为 0 时很关键：可直接把网格“停”在指定相位上。
    phaseX = normalizeOffset(startXOffset(), gridSize());
    phaseY = normalizeOffset(startYOffset(), gridSize());
  };

  const updatePhaseStyles = () => {
    // 这里用 CSS 变量把动画相位推给样式层，避免每一帧都逐个改线条节点。
    container.style.setProperty("--square-grid-phase-x", `${phaseX}px`);
    container.style.setProperty("--square-grid-phase-y", `${phaseY}px`);
  };

  const readContainerSize = () => {
    const rect = container.getBoundingClientRect();
    const width = Math.max(0, Math.ceil(rect.width));
    const height = Math.max(0, Math.ceil(rect.height));

    // 尺寸没有发生变化时，不重建 DOM，减少不必要的抖动。
    if (width === currentSize.width && height === currentSize.height) {
      return;
    }

    currentSize = { width, height };
    rebuildGrid();
  };

  const rebuildGrid = () => {
    if (!container) return;

    const { width, height } = currentSize;
    const size = gridSize();

    // 先清空旧节点，再按新的容器尺寸和网格尺寸重建。
    container.replaceChildren();

    // 竖线：从左侧多留一个网格宽度开始，到右侧多留一个网格宽度结束。
    // 这样在平移时不会出现边缘缺口。
    for (let x = -size; x <= width + size; x += size) {
      const line = document.createElement("div");
      line.className =
        "bgmodule-squaregrid-line bgmodule-squaregrid-line--vertical";
      line.style.setProperty("--square-grid-line-x", `${x}px`);
      line.style.height = `${height}px`;
      container.appendChild(line);
    }

    // 横线：同样多预留一个网格高度，保证缩放时依旧能够覆盖整个背景。
    // 这里让横线本身整条横跨容器宽度，再通过垂直偏移制造“上下漂移”的效果。
    for (let y = -size; y <= height + size; y += size) {
      const line = document.createElement("div");
      line.className =
        "bgmodule-squaregrid-line bgmodule-squaregrid-line--horizontal";
      line.style.setProperty("--square-grid-line-y", `${y}px`);
      // line.style.height = `1px`;
      container.appendChild(line);
    }

    // 重建后，重新同步一次位移，确保新节点立即对齐当前动画相位。
    updatePhaseStyles();
  };

  onMount(() => {
    // 在首次渲染前先应用起始偏移，避免首帧从 0 偏移闪动到目标偏移。
    applyStartOffsets();
    updatePhaseStyles();

    // 组件首次挂载时，先建立尺寸监听，再读取一次初始尺寸。
    resizeObserver = new ResizeObserver(() => {
      readContainerSize();
    });
    resizeObserver.observe(container);

    readContainerSize();

    const tick = (timestamp: number) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }

      const deltaSeconds = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      // X 速度只驱动竖线的横向平移。
      // 负值代表向左移动，正值代表向右移动。
      phaseX = normalizeOffset(phaseX + xSpeed() * deltaSeconds, gridSize());

      // Y 速度只驱动横线的垂直平移。
      // 正值向下，负值向上；线条整体仍然保持横向长线的形态。
      phaseY = normalizeOffset(phaseY + ySpeed() * deltaSeconds, gridSize());

      updatePhaseStyles();
      animationId = window.requestAnimationFrame(tick);
    };

    animationId = window.requestAnimationFrame(tick);
  });

  onCleanup(() => {
    if (animationId) {
      window.cancelAnimationFrame(animationId);
    }
    resizeObserver?.disconnect();
    container.replaceChildren();
  });

  // 这里不使用 Solid 的逐节点响应式渲染，而是交给 DOM + CSS 变量处理动画，
  // 这样尺寸变化和帧动画的职责会更清晰，也更容易控制性能。
  createEffect(() => {
    // 当网格尺寸或起始偏移变化时，重置相位并重建网格。
    // 这样可确保 startXOffset/startYOffset 在运行时更新后也能立即生效。
    gridSize();
    startXOffset();
    startYOffset();

    applyStartOffsets();
    updatePhaseStyles();

    if (currentSize.width > 0 || currentSize.height > 0) {
      rebuildGrid();
    }
  });

  return (
    <div
      ref={(el) => (container = el!)}
      class="bgmodule-squaregrid"
      aria-hidden="true"
    />
  );
};

export default AnimatedSquareGridBackground;
