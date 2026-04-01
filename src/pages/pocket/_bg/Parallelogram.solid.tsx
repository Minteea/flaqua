/** @jsxImportSource solid-js */
import "./Parallelogram.css";
import {
  createEffect,
  onCleanup,
  createSignal,
  createMemo,
  onMount,
} from "solid-js";

interface AnimatedParallelogramBackgroundProps {
  minWidth?: number;
  maxWidth?: number;
  minSpeed?: number;
  maxSpeed?: number;
  skewAngle?: number;
  minSpawnInterval?: number;
  maxSpawnInterval?: number;
  minOpacity?: number;
  maxOpacity?: number;
}

const AnimatedParallelogramBackground = (
  props: AnimatedParallelogramBackgroundProps,
) => {
  console.log("AnimatedParallelogramBackground initialized");
  const minWidth = () => props.minWidth ?? 50;
  const maxWidth = () => props.maxWidth ?? 150;
  const minSpeed = () => props.minSpeed ?? 1;
  const maxSpeed = () => props.maxSpeed ?? 5;
  const skewAngle = () => props.skewAngle ?? 30;
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
      const width = Math.random() * (maxWidth() - minWidth()) + minWidth();
      const speed = Math.random() * (maxSpeed() - minSpeed()) + minSpeed();
      const duration = window.innerWidth / speed;
      const opacity =
        Math.random() * (maxOpacity() - minOpacity()) + minOpacity();

      const id = idCounter();
      setIdCounter(id + 1);

      const parallelogram = document.createElement("div");
      parallelogram.className = "bgmodule-parallelogram";
      parallelogram.id = `pg-${id}`;
      parallelogram.style.cssText = `
        width: ${width}px;
        --shapewidth: ${Math.tan((skewAngle() * Math.PI) / 180) * container.clientHeight + width}px;
        --skew-angle: ${skewAngle()}deg;
        --opacity: ${opacity};
        --duration: ${duration}s;
      `;

      container.appendChild(parallelogram);

      // 动画完成后移除元素
      const timer = setTimeout(() => {
        parallelogram.remove();
        clearTimeout(timer);
      }, duration * 1000);
    };

    // 初始生成一些平行四边形
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
      class="bgmodule-parallelogram-background"
    />
  );
};

export default AnimatedParallelogramBackground;
