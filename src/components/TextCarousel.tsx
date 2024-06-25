import { type ReactNode, useEffect, useRef, useState } from "react";
import { useInterval } from "ahooks";

type ICarouselItem = ReactNode | (() => ReactNode);

type ICarouselDataItem = ReactNode;

export interface ICarouselArgs {
  list: ICarouselItem[];
  play?: boolean;
  interval: number;
  reverse?: boolean;
}

/** 文字轮播 */
export function TextCarousel({
  list,
  play = true,
  interval,
  reverse,
}: ICarouselArgs) {
  const [data, setData] = useState<[ICarouselDataItem, ICarouselDataItem]>([
    null,
    null,
  ]);
  const [count, setCount] = useState(0);
  const currentIndex = useRef<number>(-1);

  const next = () => {
    currentIndex.current += 1;
    if (currentIndex.current >= list.length) {
      currentIndex.current = list.length ? 0 : -1;
    }
    const item = list[currentIndex.current];
    setCount(count + 1);
    setData([
      item ? (typeof item == "function" ? item() : item) : null,
      data[0],
    ]);
  };

  useEffect(() => {
    next();
  }, []);

  useInterval(
    () => {
      next();
    },
    play ? interval || null : null
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
