let timer = 0;

declare global {
  interface Window {
    tuna: any;
  }
}

class TunaUpdateEvent extends Event {
  data: any;
  constructor(data: any) {
    super("tuna:update");
    this.data = data;
  }
}

function tunaPoll() {
  fetch("http://localhost:1608/")
    .then((res) => res.json())
    .then((res) => {
      window.clearTimeout(timer);
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
