export class FlaquaUpdateEvent extends Event {
  key: string;
  value: any;
  constructor(key: string, value: any) {
    super("flaqua:update");
    this.key = key;
    this.value = value;
  }
}
export class FlaquaInitEvent extends Event {
  data: any;
  constructor(data: Record<string, any>) {
    super("flaqua:init");
    this.data = data;
  }
}
