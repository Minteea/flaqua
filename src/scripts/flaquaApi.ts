import type { WritableAtom } from "nanostores";

export type FlaquaStore = Record<string, WritableAtom>;

export let store = <Record<string, WritableAtom>>{};

let bindStoreHandler: () => void;

/** 绑定状态 */
export function bindStore(flaquaStore: FlaquaStore) {
  store = flaquaStore;
  bindStoreHandler?.();
}

export function onBindStore(callback: () => void) {
  bindStoreHandler = callback;
  if (store) callback();
}

/** 初始化状态值 */
export function initStore(values: Record<string, any>) {
  for (const key in values) {
    setValue(key, values[key]);
  }
}

/** 设置状态值 */
export function setValue<T>(key: string, value: T) {
  const atom = store[key];
  if (atom) {
    atom.set(getContent(value));
    console.log(true, key, atom);
    return true;
  } else {
    console.log(false, key);
    return false;
  }
}

/** 通过字符串获取内容
 * 字符串开头若含有:号，表示该内容为表达式
 * 可使用开头::的形式转义
 */
export function getContent(c: any): any {
  if (typeof c === "string" && c[0] === ":") {
    const fnStr = c.substring(1);
    if (fnStr[0] === ":") {
      return fnStr;
    }
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`return (${fnStr})`);
      return fn();
    } catch (error) {
      return c;
    }
  } else if (Array.isArray(c)) {
    return c.map((item) => getContent(item));
  } else if (typeof c === "object" && c !== null) {
    const obj: any = {};
    for (let k in c) {
      obj[k] = getContent((c as any)[k]);
    }
    return;
  } else {
    return c;
  }
}
