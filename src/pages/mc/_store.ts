import { atom } from "nanostores";
import { textNowPlaying } from "@/scripts/tuna";


/** 顶栏切换间隔 */
export const topInterval = atom(5000);
/** 顶栏内容 */
export const topContent = atom([]);
/** 底栏速度 */
export const bottomSpeed = atom(50);
/** 底栏内容 */
export const bottomContent = atom([]);

/** 背景 */
export const background = atom("");
/** 内容背景 */
export const contentBg = atom("");
/** 前景 */
export const foreground = atom("");
/** 样式 */
export const sceneStyle = atom("");
/** 主题 */
export const sceneTheme = atom("");

const urlInfo = new URL(location.href).searchParams.get("info");

/** 加载信息 */
export const loadingInfo = atom([
  urlInfo || "主播准备中，请稍等^_^",
  textNowPlaying,
]);

/** 结束信息 */
export const goodbyeInfo = atom([
  urlInfo || "主播下播啦，感谢支持UwU",
  textNowPlaying,
]);

/** 可操作store */
export const store = {
  topInterval,
  topContent,
  bottomSpeed,
  bottomContent,
  background,
  contentBg,
  foreground,
  sceneStyle,
  sceneTheme,
};
