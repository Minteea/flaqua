/** @jsxImportSource solid-js */
import "./DotGrid.css";
import { createEffect, createMemo, onCleanup, onMount } from "solid-js";

interface DotGridBackgroundProps {
  xSpeed?: number;
  ySpeed?: number;
  spacing?: number;
  dotDiameter?: number;
  dotDiameter2?: number;
  skewOffsetX?: number;
  skewOffsetY?: number;
  startXOffset?: number;
  startYOffset?: number;
}

interface GridSize {
  width: number;
  height: number;
}

// 将偏移值规范到 [0, spacing) 区间，保证循环位移在任意正负输入下都连续。
const normalizeOffset = (value: number, spacingValue: number) => {
  if (spacingValue <= 0) return 0;
  return ((value % spacingValue) + spacingValue) % spacingValue;
};

const AnimatedDotGridBackground = (props: DotGridBackgroundProps) => {
  // 参数使用 memo 包装：
  // 1) 有默认值；
  // 2) 外部 props 动态变化时可以即时反映。
  const xSpeed = createMemo(() => props.xSpeed ?? 18);
  const ySpeed = createMemo(() => props.ySpeed ?? 12);
  const spacing = createMemo(() => Math.max(2, props.spacing ?? 48));
  const dotDiameter = createMemo(() =>
    Math.max(1, Math.min(props.dotDiameter ?? 6, spacing())),
  );
  const dotDiameter2 = createMemo(() =>
    Math.max(1, Math.min(props.dotDiameter2 ?? dotDiameter(), spacing())),
  );
  const skewOffsetX = createMemo(() => props.skewOffsetX ?? 0);
  const skewOffsetY = createMemo(() => props.skewOffsetY ?? 0);
  const startXOffset = createMemo(() => props.startXOffset ?? 0);
  const startYOffset = createMemo(() => props.startYOffset ?? 0);

  let container!: HTMLDivElement;
  let animationId = 0;
  let resizeObserver: ResizeObserver | undefined;

  // 记录当前容器尺寸。尺寸变化时会重建点阵，防止边缘出现空白。
  let currentSize: GridSize = { width: 0, height: 0 };

  // 相位表示点阵整体偏移：
  // phaseX -> X 方向位移；phaseY -> Y 方向位移。
  let phaseX = 0;
  let phaseY = 0;
  let lastTimestamp = 0;

  const applyStartOffsets = () => {
    // 起始偏移统一做模运算。
    // 这在某个方向速度为 0 时很有用：可将格点固定在指定初始相位。
    phaseX = normalizeOffset(startXOffset(), spacing());
    phaseY = normalizeOffset(startYOffset(), spacing());
  };

  const updatePhaseStyles = () => {
    // 每帧只更新容器变量，避免逐个更新点节点，降低开销。
    container.style.setProperty("--dot-grid-phase-x", `${phaseX}px`);
    container.style.setProperty("--dot-grid-phase-y", `${phaseY}px`);
    container.style.setProperty(
      "--dot-grid-dot-diameter",
      `${dotDiameter()}px`,
    );
    container.style.setProperty(
      "--dot-grid-dot-diameter-2",
      `${dotDiameter2()}px`,
    );
  };

  const readContainerSize = () => {
    const rect = container.getBoundingClientRect();
    const width = Math.max(0, Math.ceil(rect.width));
    const height = Math.max(0, Math.ceil(rect.height));

    // 尺寸未变则不重建，避免不必要的 DOM 抖动。
    if (width === currentSize.width && height === currentSize.height) {
      return;
    }

    currentSize = { width, height };
    rebuildDots();
  };

  const rebuildDots = () => {
    if (!container) return;

    const { width, height } = currentSize;
    const spacingValue = spacing();
    const halfSpacing = spacingValue / 2;
    const skewStepX = skewOffsetX();
    const skewStepY = skewOffsetY();

    // 每层倾斜会把点阵向外推开，因此需要额外的补边空间。
    // 这里按当前视口尺寸估算层数，再将每层偏移量折算成补边范围。
    const estimatedRowCount = Math.ceil(height / spacingValue) + 4;
    const estimatedColumnCount = Math.ceil(width / spacingValue) + 4;
    const skewPaddingX = Math.ceil(estimatedRowCount * Math.abs(skewStepX));
    const skewPaddingY = Math.ceil(estimatedColumnCount * Math.abs(skewStepY));

    // 先清空旧点，再根据当前尺寸重建。
    container.replaceChildren();

    // 第一组格点：原始格点。
    // rowIndex 控制每一层在 X 方向上的偏移，columnIndex 控制每一列在 Y 方向上的偏移。
    for (
      let rowIndex = 0, y = -spacingValue - skewPaddingY;
      y <= height + spacingValue + skewPaddingY;
      y += spacingValue, rowIndex += 1
    ) {
      const rowSkewX = rowIndex * skewStepX;

      for (
        let columnIndex = 0, x = -spacingValue - skewPaddingX;
        x <= width + spacingValue + skewPaddingX;
        x += spacingValue, columnIndex += 1
      ) {
        const columnSkewY = columnIndex * skewStepY;
        const dot = document.createElement("div");
        dot.className = "bgmodule-dotgrid-dot";
        dot.style.setProperty("--dot-grid-dot-x", `${x}px`);
        dot.style.setProperty("--dot-grid-dot-y", `${y}px`);
        dot.style.setProperty("--dot-grid-skew-x", `${rowSkewX}px`);
        dot.style.setProperty("--dot-grid-skew-y", `${columnSkewY}px`);
        container.appendChild(dot);
      }
    }

    // 第二组格点：在 X/Y 两个方向上都偏移半个格距，与第一组交错排列。
    for (
      let rowIndex = 0, y = -spacingValue + halfSpacing - skewPaddingY;
      y <= height + spacingValue + skewPaddingY;
      y += spacingValue, rowIndex += 1
    ) {
      const rowSkewX = rowIndex * skewStepX;

      for (
        let columnIndex = 0, x = -spacingValue + halfSpacing - skewPaddingX;
        x <= width + spacingValue + skewPaddingX;
        x += spacingValue, columnIndex += 1
      ) {
        const columnSkewY = columnIndex * skewStepY;
        const dot = document.createElement("div");
        dot.className = "bgmodule-dotgrid-dot bgmodule-dotgrid-dot--offset";
        dot.style.setProperty("--dot-grid-dot-x", `${x}px`);
        dot.style.setProperty("--dot-grid-dot-y", `${y}px`);
        dot.style.setProperty("--dot-grid-skew-x", `${rowSkewX}px`);
        dot.style.setProperty("--dot-grid-skew-y", `${columnSkewY}px`);
        container.appendChild(dot);
      }
    }

    // 重建后同步一次样式变量，让新节点立即对齐当前相位。
    updatePhaseStyles();
  };

  onMount(() => {
    // 首帧前先应用起始偏移，避免初始闪动。
    applyStartOffsets();
    updatePhaseStyles();

    // 监听容器尺寸变化，保证响应布局调整。
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

      // X/Y 速度均支持负值：
      // 正值向右/向下，负值向左/向上。
      phaseX = normalizeOffset(phaseX + xSpeed() * deltaSeconds, spacing());
      phaseY = normalizeOffset(phaseY + ySpeed() * deltaSeconds, spacing());

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

  createEffect(() => {
    // 当 spacing / dotDiameter / dotDiameter2 / skew 参数 / 起始偏移变化时，
    // 重新同步相位并重建点阵。
    // 速度参数不需要触发重建，动画循环会自动读取最新值。
    spacing();
    dotDiameter();
    dotDiameter2();
    skewOffsetX();
    skewOffsetY();
    startXOffset();
    startYOffset();

    applyStartOffsets();
    updatePhaseStyles();

    if (currentSize.width > 0 || currentSize.height > 0) {
      rebuildDots();
    }
  });

  return (
    <div
      ref={(el) => (container = el!)}
      class="bgmodule-dotgrid"
      aria-hidden="true"
    />
  );
};

export default AnimatedDotGridBackground;
