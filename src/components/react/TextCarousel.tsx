/** @jsxImportSource react */

import { type ReactNode, useEffect, useRef, useState } from "react";
import { useInterval } from "ahooks";

type ICarouselItem =
  | string
  | Record<string, any>
  | (() => string | Record<string, any>);

type ICarouselDataItem = ReactNode;

export interface ICarouselArgs {
  list: ICarouselItem[];
  play?: boolean;
  interval: number;
  reverse?: boolean;
  autoFrozen?: boolean;
  customContentParser?: (a: Record<string, any>) => ReactNode;
}

/** 文字轮播 */
export function TextCarousel({
  list,
  play = true,
  interval,
  reverse,
  autoFrozen = true,
  customContentParser,
}: ICarouselArgs) {
  const [data, setData] = useState<[ICarouselDataItem, ICarouselDataItem]>([
    null,
    null,
  ]);
  const [count, setCount] = useState(0);
  const currentIndex = useRef<number>(-1);
  const frozen = useRef<boolean>(false);

  const parseContent = (content: string | Record<string, any> | null) => {
    if (typeof content == "object" && content) {
      return customContentParser
        ? customContentParser(content)
        : (content.text as string) || "";
    } else return content;
  };

  // 设置autoFrozen且列表内容数量<2时，轮播会被冻结
  useEffect(() => {
    if (list.length > 1 || !autoFrozen) {
      frozen.current = false;
    } else {
      frozen.current = true;
      currentIndex.current = list.length - 1;
    }
  }, [list, autoFrozen]);

  // 冻结状态下若内容发生改变，则立即next
  useEffect(() => {
    if (frozen.current) {
      next();
    }
  }, [list]);

  const next = () => {
    currentIndex.current += 1;
    if (currentIndex.current >= list.length) {
      currentIndex.current = list.length ? 0 : -1;
    }
    const item = list[currentIndex.current];
    setCount(count + 1);
    setData([
      item ? parseContent(typeof item == "function" ? item() : item) : null,
      data[0],
    ]);
  };

  useEffect(() => {
    next();
  }, []);

  useInterval(
    () => {
      if (frozen.current) return;
      next();
    },
    play ? interval || null : null,
  );

  return (
    <div
      className={`carousel ${reverse ? "carousel-reverse" : ""}`}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {data.map((item, index) => (
        <div
          key={count - index}
          className={`carousel-content carousel-content-${
            index ? "leave" : "enter"
          }`}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          {item != null ? <div className="carousel-item">{item}</div> : null}
        </div>
      ))}
    </div>
  );
}
