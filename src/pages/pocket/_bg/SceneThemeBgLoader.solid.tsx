/** @jsxImportSource solid-js */
import { useStore } from "@nanostores/solid";
import { sceneTheme } from "../_store";
import s2026 from "../_style/2026.ts";
import { Show } from "solid-js";
import DynamicBackgroundLoader from "./loader.solid";

const themeLists: {
  [name: string]: {
    dynamicBackground: { name: string; props: Record<string, any> };
  };
}[] = [s2026];

const getThemeInfo = (themeName: string) => {
  for (const theme of themeLists) {
    if (theme[themeName]) {
      return theme[themeName];
    }
  }
  return undefined;
};

const SceneThemeBgLoader = () => {
  const themeName = useStore(sceneTheme);
  const themeInfo = () => getThemeInfo(themeName());
  return (
    <Show when={themeInfo()}>
      {(themeInfo) => (
        <DynamicBackgroundLoader
          componentName={themeInfo().dynamicBackground.name}
          componentProps={themeInfo().dynamicBackground.props}
        />
      )}
    </Show>
  );
};

export default SceneThemeBgLoader;
