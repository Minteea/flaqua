import { FlaquaInitEvent, FlaquaUpdateEvent } from "./flaquaEvents";

// BroadcastChannel api

const channel = new BroadcastChannel("flaqua");
channel.addEventListener("message", (e) => {
  switch (e.data.command) {
    case "init":
      window.dispatchEvent(new FlaquaInitEvent(e.data.data));
      break;
    case "update":
      window.dispatchEvent(new FlaquaUpdateEvent(e.data.key, e.data.value));
      break;
  }
});

export function initRequest() {
  channel.postMessage({ command: "request" });
}
