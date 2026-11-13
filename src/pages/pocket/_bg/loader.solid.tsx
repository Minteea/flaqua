/** @jsxImportSource solid-js */
import { lazy, createMemo, Show } from "solid-js";
import { Dynamic } from "solid-js/web";

const componentList = {
  Parallelogram: lazy(() => import("./Parallelogram.solid.tsx")),
  BubbleFlow: lazy(() => import("./BubbleFlow.solid.tsx")),
  SquareGrid: lazy(() => import("./SquareGrid.solid.tsx")),
  DotGrid: lazy(() => import("./DotGrid.solid.tsx")),
};

type ComponentName = keyof typeof componentList;

interface BackgroundLoaderProps {
  componentName?: string;
  componentProps?: Record<string, any>;
}

/**
 * 动态加载背景组件的加载器
 * @param componentName - 组件名称，必须在 componentList 中注册
 * @param componentProps - 传递给组件的参数
 * @returns 对应的背景组件，或 undefined（无警告）
 *
 * 行为说明：
 * - 组件名为空时：不加载任何组件，无警告也无错误
 * - 组件名在 componentList 内：加载对应的组件
 * - 组件名不在 componentList 内：不加载任何组件，打印警告
 */
const DynamicBackgroundLoader = (props: BackgroundLoaderProps) => {
  const componentName = () => props.componentName;
  const componentProps = () => props.componentProps || {};

  // 验证组件是否存在并返回对应的组件或 null
  const validComponent = createMemo(() => {
    console.log(`[BackgroundLoader] 正在加载组件: ${componentName()}`);
    const name = componentName();

    // 组件名为空时不做任何操作
    if (!name) return null;

    // 检查组件是否在列表中
    if (!(name in componentList)) {
      console.warn(
        `[BackgroundLoader] 组件 "${name}" 未在 componentList 中注册。可用的组件有：${Object.keys(componentList).join(", ")}`,
      );
      return null;
    }

    return componentList[name as ComponentName];
  });

  return (() => {
    return (
      <Show when={validComponent()}>
        {(Component) => (
          <Dynamic component={Component()} {...componentProps()} />
        )}
      </Show>
    );
  })();
};

export default DynamicBackgroundLoader;
