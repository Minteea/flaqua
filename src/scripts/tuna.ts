let timer = 0;

declare global {
  interface Window {
    tuna: any;
    textNowPlaying: () => string;
  }
}

export const textNowPlaying = () =>
  window.tuna?.status_id === 0
    ? `正在播放：${window.tuna?.title} - ${window.tuna?.artists?.join("/")}`
    : null;

window.textNowPlaying = textNowPlaying;

class TunaUpdateEvent extends CustomEvent<any> {
  constructor(data: any) {
    super("tuna:update", { detail: data });
  }
}

function tunaPoll() {
  let t = Date.now();
  fetch("http://localhost:1608/")
    .then((res) => res.json())
    .then((res) => {
      window.clearTimeout(timer);
      // console.log(Date.now() - t);
      window.dispatchEvent(new TunaUpdateEvent(res));
      window.tuna = res;
      timer = window.setTimeout(tunaPoll, 200);
    })
    .catch((err) => {
      window.clearTimeout(timer);
      console.error("无法连接tuna服务");
      console.error(err);
      timer = window.setTimeout(tunaPoll, 5000);
    });
}

export function tunaListen() {
  if (timer) return;
  timer = -1;
  tunaPoll();
}

export function tunaUnlisten() {
  window.clearTimeout(timer);
  timer = 0;
}
