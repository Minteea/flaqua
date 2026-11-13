import { atom } from "nanostores";
import { autoDefaultAtom } from "../utils/store";
import { textNowPlaying } from "@/scripts/tuna";

/** 顶栏切换间隔 */
export const topInterval = autoDefaultAtom(5000);
/** 顶栏内容 */
export const topContent = autoDefaultAtom([]);
/** 底栏速度 */
export const bottomSpeed = autoDefaultAtom(60);
/** 底栏内容 */
export const bottomContent = autoDefaultAtom([]);

/** 主题 */
export const sceneTheme = autoDefaultAtom("");

/** 直播内容 */
export const liveContent = autoDefaultAtom("");
/** 直播使用软件 */
export const liveApp = autoDefaultAtom("");
/** 直播类型 */
export const liveType = autoDefaultAtom("");
/** 直播类型 */
export const recLabel = autoDefaultAtom("LIVE");

/** 开播界面卡片 */
export const loadingTitle = autoDefaultAtom("主播准备中...");
export const loadingSubtitle = autoDefaultAtom("请稍等(￣▽￣)");
/** 下播界面卡片 */
export const goodbyeTitle = autoDefaultAtom("主播下播啦");
export const goodbyeSubtitle = autoDefaultAtom("感谢大家的支持^_^");

const urlInfo = new URL(location.href).searchParams.get("info");

/** 开播界面信息 */
export const loadingInfo = autoDefaultAtom([
  urlInfo || "主播准备中，请稍等(￣▽￣)",
  textNowPlaying,
]);
/** 下播界面信息 */
export const goodbyeInfo = autoDefaultAtom([
  urlInfo || "主播下播啦，感谢观看( · w · )",
  textNowPlaying,
]);

/** tuna */
export const tunaInfo = atom<any>({});

window.addEventListener("tuna:update", ({ detail }: CustomEvent) => {
  tunaInfo.set(detail);
  // console.log(detail);
});

/** 可操作store */
export const store = {
  topInterval,
  topContent,
  bottomSpeed,
  bottomContent,
  sceneTheme,
  liveContent,
  liveType,
  liveApp,
  loadingTitle,
  loadingSubtitle,
  goodbyeTitle,
  goodbyeSubtitle,
  loadingInfo,
  goodbyeInfo, recLabel
};
