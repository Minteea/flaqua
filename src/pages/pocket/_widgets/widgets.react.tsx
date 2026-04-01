/** @jsxImportSource react */

import { TextCarousel } from "@/components/react/TextCarousel";
import {
  topInterval,
  topContent,
  bottomContent,
  bottomSpeed,
  loadingInfo,
  goodbyeInfo,
  liveContent,
  liveType,
  tunaInfo,
  liveApp,
} from "../_store";
import { Marquee } from "@/components/react/Marquee";
import { useRef, useState } from "react";
import { useInterval } from "ahooks";
import { useStore } from "@nanostores/react";
import dayjs from "dayjs";
import clsx from "clsx";

export function LoadingInfo() {
  const content = useStore(loadingInfo);
  return <Marquee list={content} speed={60} />;
}
export function GoodbyeInfo() {
  const content = useStore(goodbyeInfo);
  return <Marquee list={content} speed={60} />;
}

export function TopInfo() {
  const content = useStore(topContent);
  const interval = useStore(topInterval);
  return (
    <TextCarousel
      list={content}
      interval={interval}
      customContentParser={({ icon, text }) => {
        return (
          <>
            {icon ? <i className={`ti ti-${icon}`}></i> : null}
            <span>{text}</span>
          </>
        );
      }}
    />
  );
}
export function LiveContent() {
  const content = useStore(liveContent);
  return <div></div>;
}

export function BottomInfo() {
  const content = useStore(bottomContent);
  const speed = useStore(bottomSpeed);
  return <Marquee list={content} speed={speed} />;
}

/** 时间显示 */
export function TimeLabel() {
  const [time, setTime] = useState(dayjs());
  useInterval(() => {
    setTime(dayjs());
  }, 200);
  return <span>{time.format("HH:mm:ss")}</span>;
}

/** 时间显示 */
export function TimeLabelMinute() {
  const [time, setTime] = useState(dayjs().valueOf());
  const showColon = useRef(true);
  useInterval(() => {
    setTime(dayjs().valueOf());
  }, 200);
  useInterval(() => {
    showColon.current = !showColon.current;
  }, 500);

  return (
    <>
      <span>{dayjs(time).format("HH")}</span>
      <span style={{ visibility: showColon.current ? "visible" : "hidden" }}>
        :
      </span>
      <span>{dayjs(time).format("mm")}</span>
    </>
  );
}

/** 正在播放 */
export function NowPlaying() {
  const tuna = useStore(tunaInfo);
  const isPlaying = tuna?.status === "playing";
  const text = `${tuna!.title} - ${tuna!.artists?.join("/")}`;
  return (
    <div
      className="now-playing"
      data-playing={isPlaying}
      style={{ display: "flex", alignItems: "center" }}
    >
      <i className="ti ti-music" />
      <span>正在播放：{text}</span>
    </div>
  );
}

export function FooterTaskInfo() {
  const content = useStore(liveContent);
  return (
    <div id="footer-task" className="footer-item">
      <div className="footer-item-content">
        <i className="ti ti-device-gamepad-3"></i>
        <span>{content}</span>
      </div>
    </div>
  );
}
export function FooterAppInfo() {
  const appInfo = useStore(liveApp);
  return (
    <div
      id="footer-app"
      className={clsx("footer-item", { "is-hidden": !appInfo })}
    >
      <div className="footer-item-content">
        <i className="ti ti-app-window"></i>
        <span>{appInfo}</span>
      </div>
    </div>
  );
}
export function FooterMusicInfo() {
  const tuna = useStore(tunaInfo);
  const isPlaying = tuna?.status === "playing";
  const text = `${tuna!.title} - ${tuna!.artists?.join("/")}`;
  return (
    <div
      id="footer-music"
      className={clsx("footer-item", { "is-hidden": !isPlaying })}
    >
      <div className="footer-item-content">
        <i className="ti ti-music"></i>
        <span>正在播放：{text}</span>
      </div>
    </div>
  );
}
