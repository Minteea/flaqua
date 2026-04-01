/** @jsxImportSource solid-js */
import "./BubbleFlow.css";
import {
  createEffect,
  onCleanup,
  createSignal,
  createMemo,
  onMount,
} from "solid-js";

interface AnimatedBubbleFlowBackgroundProps {
  minRadius?: number;
  maxRadius?: number;
  minSpeed?: number;
  maxSpeed?: number;
  minSpawnInterval?: number;
  maxSpawnInterval?: number;
  minOpacity?: number;
  maxOpacity?: number;
}

const AnimatedBubbleFlowBackground = (
  props: AnimatedBubbleFlowBackgroundProps,
) => {
  console.log("AnimatedBubbleFlowBackground initialized");
  const minRadius = () => props.minRadius ?? 25;
  const maxRadius = () => props.maxRadius ?? 75;
  const minSpeed = () => props.minSpeed ?? 1;
  const maxSpeed = () => props.maxSpeed ?? 5;
  const minSpawnInterval = () => props.minSpawnInterval ?? 1000;
  const maxSpawnInterval = () => props.maxSpawnInterval ?? 6000;
  const minOpacity = () => props.minOpacity ?? 0.2;
  const maxOpacity = () => props.maxOpacity ?? 0.5;

  let container!: HTMLDivElement;
  const [idCounter, setIdCounter] = createSignal(0);

  let spawnTimeout_id: ReturnType<typeof setTimeout>;

  onMount(() => {
    console.log("AnimatedParallelogramBackground mounted");
    console.log("effect");
    const spawnParallelogram = () => {
      console.log("Parallelogram spawned");
      const radius = Math.random() * (maxRadius() - minRadius()) + minRadius();
      const speed = Math.random() * (maxSpeed() - minSpeed()) + minSpeed();
      const duration = window.innerWidth / speed;
      const opacity =
        Math.random() * (maxOpacity() - minOpacity()) + minOpacity();
      const y = Math.random() * (window.innerHeight + radius * 2) - radius * 2;
      const id = idCounter();
      setIdCounter(id + 1);

      const parallelogram = document.createElement("div");
      parallelogram.className = "bgmodule-bubbleflow-item";
      parallelogram.id = `bgmodule-bubbleflow-${id}`;
      parallelogram.style.cssText = `
        --radius: ${radius}px;
        --opacity: ${opacity};
        --duration: ${duration}s;
        --rn-color: ${Math.random() * 100}%;
        top: ${y}px;
      `;

      container.appendChild(parallelogram);

      // 动画完成后移除元素
      const timer = setTimeout(() => {
        parallelogram.remove();
        clearTimeout(timer);
      }, duration * 1000);
    };

    // 初始生成一些泡泡
    spawnParallelogram();

    const scheduleNextSpawn = () => {
      spawnTimeout_id = setTimeout(
        () => {
          clearTimeout(spawnTimeout_id);
          spawnParallelogram();
          scheduleNextSpawn();
        },
        Math.random() * (maxSpawnInterval() - minSpawnInterval()) +
          minSpawnInterval(),
      );
    };

    scheduleNextSpawn();
  });
  onCleanup(() => {
    clearTimeout(spawnTimeout_id);
    container.innerHTML = "";
  });

  return (
    <div
      ref={(el) => (container = el!)}
      class="bgmodule-bubbleflow-background"
    />
  );
};

export default AnimatedBubbleFlowBackground;
