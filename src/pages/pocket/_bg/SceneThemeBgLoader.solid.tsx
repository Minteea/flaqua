/** @jsxImportSource solid-js */
import { useStore } from "@nanostores/solid";
import { sceneTheme } from "../_store";
import s2026 from "../_style/2026.ts";
import { Show } from "solid-js";
import DynamicBackgroundLoader from "./loader.solid";

const themeLists: {
  [name: string]: {
    dynamicBackground?: { name: string; props: Record<string, any> };
    mainBackground?: { name: string; props: Record<string, any> };
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

export const SceneThemeBgLoader = () => {
  const themeName = useStore(sceneTheme);
  const themeInfo = () => getThemeInfo(themeName());
  return (
    <Show when={themeInfo()?.dynamicBackground}>
      {(dynamicBackground) => (
        <DynamicBackgroundLoader
          componentName={dynamicBackground().name}
          componentProps={dynamicBackground().props}
        />
      )}
    </Show>
  );
};

export const MainBgLoader = () => {
  const themeName = useStore(sceneTheme);
  const themeInfo = () => getThemeInfo(themeName());
  return (
    <Show when={themeInfo()?.mainBackground}>
      {(mainBackground) => (
        <DynamicBackgroundLoader
          componentName={mainBackground().name}
          componentProps={mainBackground().props}
        />
      )}
    </Show>
  );
};

export default SceneThemeBgLoader;
