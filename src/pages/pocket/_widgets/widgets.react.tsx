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
  recLabel,
  tunaInfo,
  liveApp,
  loadingTitle,
  loadingSubtitle,
  goodbyeTitle,
  goodbyeSubtitle,
} from "../_store";
import { Marquee } from "@/components/react/Marquee";
import { useRef, useState } from "react";
import { useInterval } from "ahooks";
import { useStore } from "@nanostores/react";
import dayjs from "dayjs";
import clsx from "clsx";
import type {} from "dayjs/plugin/duration";

function formatDuration(ms: number, format: string) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const tokens: Record<string, string> = {
    HH: String(hours).padStart(2, "0"),
    H: String(hours),
    mm: String(minutes).padStart(2, "0"),
    m: String(minutes),
    ss: String(seconds).padStart(2, "0"),
    s: String(seconds),
  };

  return format.replace(/HH|H|mm|m|ss|s/g, (token) => tokens[token]);
}

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
      customContentParser={({ icon, text, html }) => {
        return (
          <>
            {icon ? <i className={`ti ti-${icon}`}></i> : null}
            {html ? (
              <span dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <span>{text}</span>
            )}
          </>
        );
      }}
    />
  );
}

export function TimerContent({
  content,
}: {
  content:
    | string
    | { timer: { time: string | number; format?: string; timeout?: string } };
}) {
  if (typeof content === "object" && content.timer) {
    const { time, format, timeout } = content.timer;
    let timestamp = dayjs(time).valueOf();
    if (Number.isNaN(timestamp) && typeof time === "string") {
      let timeParts = time.split(":");
      if (timeParts.length === 2) {
        const now = dayjs();
        let target = now
          .hour(Number(timeParts[0]))
          .minute(Number(timeParts[1]))
          .second(0);
        const diffHours = dayjs.duration(now.diff(target)).asHours();
        if (diffHours > 12) {
          target = target.add(1, "day");
        } else if (diffHours < -12) {
          target = target.subtract(1, "day");
        }

        timestamp = target.valueOf();
      } else if (timeParts.length === 3) {
        const now = dayjs();
        const target = now
          .hour(Number(timeParts[0]))
          .minute(Number(timeParts[1]))
          .second(Number(timeParts[2]));
        timestamp = target.valueOf();
      }
    }
    return (
      <CountdownLabel
        targetTimestamp={timestamp}
        format={format}
        timeoutFormat={timeout}
      />
    );
  }
  return content.toString() || "";
}

// 允许的time格式：时间戳、dayjs可解析的字符串
// 符合HH:mm / HH:mm:ss格式的字符串：表示距当天12小时内的倒计时
export function LoadingTitle() {
  const content = useStore(loadingTitle);
  return <TimerContent content={content} />;
}
export function LoadingSubtitle() {
  const content = useStore(loadingSubtitle);
  return <TimerContent content={content} />;
}
export function GoodbyeTitle() {
  const content = useStore(goodbyeTitle);
  return content;
}
export function GoodbyeSubtitle() {
  const content = useStore(goodbyeSubtitle);
  return content;
}

export function BottomInfo() {
  const content = useStore(bottomContent);
  const speed = useStore(bottomSpeed);
  return (
    <Marquee
      list={content}
      speed={speed}
      customContentParser={({ icon, text, html }) => {
        return (
          <>
            {icon ? <i className={`ti ti-${icon}`}></i> : null}
            {html ? (
              <span dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <span>{text}</span>
            )}
          </>
        );
      }}
    />
  );
}

/** 时间显示 */
export function TimeLabel() {
  const [time, setTime] = useState(dayjs());
  useInterval(() => {
    setTime(dayjs());
  }, 200);
  return <span>{time.format("HH:mm:ss")}</span>;
}

type CountdownLabelProps = {
  targetTimestamp: number;
  format?: string;
  timeoutFormat?: string;
};

/** 倒计时显示 */
export function CountdownLabel({
  targetTimestamp,
  format = "HH:mm:ss",
  timeoutFormat = "+HH:mm:ss",
}: CountdownLabelProps) {
  const [now, setNow] = useState(Date.now());

  useInterval(() => {
    setNow(Date.now());
  }, 200);

  const diff = targetTimestamp - now;
  const isTimeout = diff < 0;
  const displayMs = Math.abs(diff);

  return (
    <span>{formatDuration(displayMs, isTimeout ? timeoutFormat : format)}</span>
  );
}

/** RecLabel */
export function RecLabel() {
  const recLabelValue = useStore(recLabel);
  return <span>{recLabelValue || "LIVE"}</span>;
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
