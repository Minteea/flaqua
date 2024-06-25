import { useEffect, useRef, useState, type ReactNode } from "react";
import useResizeObserver from "use-resize-observer";
import { useAnimationFrame } from "@/hooks";

type IMarqueeItem = ReactNode | (() => ReactNode);

type IMarqueeDataItem = IKeyValue<ReactNode, number>;

interface IKeyValue<V, K = string> {
  value: V;
  key: K;
}

export interface IMarqueeArgs {
  list: IMarqueeItem[];
  play?: boolean;
  speed: number;
}

/** 垂直滚动文字跑马灯 */
export function MarqueeVertical({ list, play = true, speed }: IMarqueeArgs) {
  const [data, setData] = useState<IMarqueeDataItem[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const count = useRef(0);
  // 第一条的内容
  const firstIndex = useRef<number>(0);
  const firstElement = useRef<HTMLDivElement | null>(null);
  // 最后一条的内容
  const lastIndex = useRef<number>(-1);
  const lastElement = useRef<HTMLDivElement | null>(null);
  const timestamp = useRef<number>(0);
  const reverse = speed < 0;
  // 监听容器及内容宽度
  const { ref: container, height: containerHeight } =
    useResizeObserver<HTMLDivElement>();
  const { ref: content, height: contentHeight } =
    useResizeObserver<HTMLDivElement>();
  const { height: firstHeight } = useResizeObserver<HTMLDivElement>({
    ref: firstElement,
  });
  const { height: lastHeight } = useResizeObserver<HTMLDivElement>({
    ref: lastElement,
  });
  // 从跑马灯末尾推入一个item
  const pushItem = (item: IMarqueeItem) => {
    count.current += 1;
    let newList = [...data];
    newList.push({
      value: typeof item == "function" ? item() : item,
      key: count.current,
    });
    setData(newList);
  };

  useEffect(() => {
    if (play) {
      timestamp.current = Date.now();
    } else {
      timestamp.current = 0;
    }
  }, [play]);

  // 从跑马灯中移除最后一个item
  const popItem = () => {
    let newList = [...data];
    newList.pop();
    setData(newList);
  };

  // 从跑马灯头部推入一个item
  const unshiftItem = (item: IMarqueeItem) => {
    count.current += 1;
    let newList = [...data];
    newList.unshift({
      value: typeof item == "function" ? item() : item,
      key: count.current,
    });
    setData(newList);
  };

  // 从跑马灯中移除第一个item
  const shiftItem = () => {
    let newList = [...data];
    newList.shift();
    setData(newList);
  };

  // 检测元素是否需要填充
  useEffect(() => {
    if (!reverse && (contentHeight || 0) + offset < (containerHeight || 0)) {
      // 检测末尾填充
      // 向data添加新内容
      lastIndex.current += 1;
      if (lastIndex.current >= list.length) {
        lastIndex.current = 0;
      }
      let item = list[lastIndex.current];
      pushItem(item);
    } else if (
      reverse &&
      (contentHeight || 0) - offset < (containerHeight || 0)
    ) {
      // 检测起始填充
      // 向data添加新内容
      firstIndex.current -= 1;
      if (firstIndex.current < 0) {
        firstIndex.current = list.length - 1;
      }
      let item = list[firstIndex.current];
      unshiftItem(item);
    }
  }, [containerHeight, contentHeight, offset]);

  useEffect(() => {
    if (reverse) {
      setOffset(offset + (contentHeight || 0) - (containerHeight || 0));
    } else {
      setOffset(offset - (contentHeight || 0) + (containerHeight || 0));
    }
  }, [reverse]);

  // 播放跑马灯
  useAnimationFrame(() => {
    const currentTime = Date.now();
    if (!reverse && offset + (firstHeight || 0) < 0) {
      // 检测第一个元素是否出界
      shiftItem();
      setOffset(
        offset +
          (firstHeight || 0) -
          ((currentTime - timestamp.current) * speed) / 1000
      );
    } else if (reverse && offset - (lastHeight || 0) > 0) {
      // 检测最后一个元素是否出界
      popItem();
      setOffset(
        offset -
          (lastHeight || 0) -
          ((currentTime - timestamp.current) * speed) / 1000
      );
    } else {
      setOffset(offset - ((currentTime - timestamp.current) * speed) / 1000);
    }
    timestamp.current = currentTime;
  }, play);

  return (
    <div
      className="marquee"
      ref={container}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        className="marquee-content"
        ref={content}
        style={{
          position: "absolute",
          whiteSpace: "break-spaces",
          top: !reverse ? offset + "px" : "",
          bottom: reverse ? -offset + "px" : "",
        }}
      >
        {data.map((item, index) => (
          <div
            className="marquee-item"
            key={item.key}
            style={{ position: "relative", display: "block" }}
            ref={(item) => {
              if (index === 0) {
                firstElement.current = item!;
              } else if (index === data.length - 1) {
                lastElement.current = item!;
              }
            }}
          >
            {item.value}
          </div>
        ))}
      </div>
    </div>
  );
}
