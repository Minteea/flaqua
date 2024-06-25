import { TextCarousel } from "@/components/TextCarousel";
import {
  topInterval,
  topContent,
  bottomContent,
  bottomSpeed,
  loadingInfo,
  goodbyeInfo,
} from "./_store";
import { Marquee } from "@/components/Marquee";
import { useState } from "react";
import { useInterval } from "ahooks";
import { useStore } from "@nanostores/react";

export function LoadingInfo() {
  const content = useStore(loadingInfo);
  return <Marquee list={content} speed={60} />;
}
export function GoodbyeInfo() {
  const content = useStore(goodbyeInfo);
  return <Marquee list={content} speed={60} />;
}

export function TopInfo() {
  const content = useStore(topContent);
  const interval = useStore(topInterval);
  return <TextCarousel list={content} interval={interval} />;
}

export function BottomInfo() {
  const content = useStore(bottomContent);
  const speed = useStore(bottomSpeed);
  return <Marquee list={content} speed={speed} />;
}

/** 时间显示 */
export function TimeLabel() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useInterval(() => {
    setTime(new Date().toLocaleTimeString());
  }, 200);
  return <span>{time}</span>;
}
