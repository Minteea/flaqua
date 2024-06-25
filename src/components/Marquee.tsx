import { type ReactNode, useEffect, useRef, useState } from "react";
import useResizeObserver from "use-resize-observer";
import { useAnimationFrame } from "@/hooks";

type IMarqueeDataItem = IKeyValue<ReactNode, number>;

interface IKeyValue<V, K = string> {
  value: V;
  key: K;
}
type IMarqueeItem = ReactNode | (() => ReactNode);

export interface IMarqueeArgs {
  list: IMarqueeItem[];
  play?: boolean;
  speed: number;
}

/** 滚动文字跑马灯 */
export function Marquee({ list, play = true, speed }: IMarqueeArgs) {
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
  // 冻结状态，列表在没有有效值的情况下会冻结
  const frozen = useRef<boolean>(false);
  // 监听容器及内容宽度
  const { ref: container, width: containerWidth } =
    useResizeObserver<HTMLDivElement>();
  const { ref: content, width: contentWidth } =
    useResizeObserver<HTMLDivElement>();
  const { width: firstWidth } = useResizeObserver<HTMLDivElement>({
    ref: firstElement,
  });
  const { width: lastWidth } = useResizeObserver<HTMLDivElement>({
    ref: lastElement,
  });
  // 从跑马灯末尾推入一个item
  const pushItem = (item: ReactNode) => {
    count.current += 1;
    let newList = [...data];
    newList.push({
      value: item,
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

  // 列表内无内容时，跑马灯会被冻结以防陷入非空检测循环
  useEffect(() => {
    if (list.length) {
      frozen.current = false;
    } else {
      frozen.current = true;
      lastIndex.current = -1;
    }
  }, [list]);

  // 从跑马灯中移除最后一个item
  const popItem = () => {
    let newList = [...data];
    newList.pop();
    setData(newList);
  };

  // 从跑马灯头部推入一个item
  const unshiftItem = (item: ReactNode) => {
    count.current += 1;
    let newList = [...data];
    newList.unshift({
      value: item,
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
    if (frozen.current) return;
    if (!reverse && (contentWidth || 0) + offset < (containerWidth || 0)) {
      // 检测末尾填充
      // 向data添加新内容
      let item: IMarqueeItem = null;
      let value: ReactNode | boolean = null;
      let tryCount = 0;
      const length = list.length;
      while (!value) {
        tryCount += 1;
        if (tryCount > length) {
          frozen.current = true;
          lastIndex.current = -1;
          return;
        }
        lastIndex.current += 1;
        if (lastIndex.current >= length) {
          lastIndex.current = 0;
        }
        item = list[lastIndex.current];
        value = typeof item == "function" ? item() : item;
      }
      pushItem(value);
    } else if (
      reverse &&
      (contentWidth || 0) - offset < (containerWidth || 0)
    ) {
      // 检测起始填充
      // 向data添加新内容
      let item: IMarqueeItem = null;
      let value: ReactNode | boolean = null;
      let tryCount = 0;
      const length = list.length;
      while (!value) {
        tryCount += 1;
        if (tryCount > length) {
          frozen.current = true;
          lastIndex.current = -1;
          return;
        }
        firstIndex.current -= 1;
        if (firstIndex.current < 0) {
          firstIndex.current = length - 1;
        }
        item = list[firstIndex.current];
        value = typeof item == "function" ? item() : item;
      }
      unshiftItem(value);
    }
  }, [containerWidth, contentWidth, offset]);

  useEffect(() => {
    if (reverse) {
      setOffset(offset + (contentWidth || 0) - (containerWidth || 0));
    } else {
      setOffset(offset - (contentWidth || 0) + (containerWidth || 0));
    }
  }, [reverse]);

  // 播放跑马灯
  useAnimationFrame(() => {
    const currentTime = Date.now();
    if (!reverse && offset + (firstWidth || 0) < 0) {
      // 检测第一个元素是否出界
      shiftItem();
      setOffset(
        offset +
          (firstWidth || 0) -
          ((currentTime - timestamp.current) * speed) / 1000
      );
    } else if (reverse && offset - (lastWidth || 0) > 0) {
      // 检测最后一个元素是否出界
      popItem();
      setOffset(
        offset -
          (lastWidth || 0) -
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
        lineHeight: "100%",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        className="marquee-content"
        ref={content}
        style={{
          position: "absolute",
          whiteSpace: "nowrap",
          left: !reverse ? offset + "px" : "",
          right: reverse ? -offset + "px" : "",
        }}
      >
        {data.map((item, index) => (
          <div
            className="marquee-item"
            key={index}
            style={{ position: "relative", display: "inline-block" }}
            ref={(item) => {
              if (index === 0) {
                firstElement.current = item!;
              }
              if (index === data.length - 1) {
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
