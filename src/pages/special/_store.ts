import { atom } from "nanostores";

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

/** 加载信息 */
export const loadingInfo = atom([
  "直播即将开始，请稍等^_^",
  () =>
    window.tuna?.status_id === 0
      ? `正在播放：${window.tuna?.title} - ${window.tuna?.artists?.join("/")}`
      : null,
]);

/** 结束信息 */
export const goodbyeInfo = atom([
  "今天的直播就到这里啦，感谢大家的支持UwU",
  () =>
    window.tuna?.status_id === 0
      ? `正在播放：${window.tuna?.title} - ${window.tuna?.artists?.join("/")}`
      : null,
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
