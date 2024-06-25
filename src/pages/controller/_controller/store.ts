import { type WritableAtom, atom } from "nanostores";
import type { IInput } from "./types";
import { FlaquaInitEvent, FlaquaUpdateEvent } from "@/scripts/flaquaEvents";

export const controlStore: WritableAtom<ControlGroup[]> = atom([]);

export const currentGroup: WritableAtom<ControlGroup | null> = atom(null);

export interface ControlGroup {
  key: string;
  desc: WritableAtom<string>;
  list: WritableAtom<WritableAtom<IInput>[]>;
  show: WritableAtom<boolean>;
}

let count = 0;

/** 添加组 */
export function addGroup(list: IInput[]) {
  const group = {
    key: `${Date.now()}.${count++}`,
    desc: atom(""),
    list: atom(list.map((input) => atom(input))),
    show: atom(true),
  };
  controlStore.set([...controlStore.value, group]);
  saveStorage();
}

/** 移除组 */
export function removeGroup(group: ControlGroup) {
  controlStore.set(controlStore.value.filter((g) => g != group));
  saveStorage();
}

export function setGroupDesc(group: ControlGroup, desc: string) {
  group.desc.set(desc);
  saveStorage();
}

/** 设置当前组 */
export function setCurrentGroup(group: ControlGroup | null) {
  currentGroup.set(group);
  group &&
    window.dispatchEvent(new FlaquaInitEvent(generateData(group.list.value)));
  window.localStorage.setItem("flaquaCurrentGroup", group?.key || "");
}

/** 添加输入 */
export function addInput(group: ControlGroup, info: IInput) {
  group.list.set([...group.list.value, atom(info)]);
  saveStorage();
}

/** 移除输入 */
export function removeInput(group: ControlGroup, input: WritableAtom<IInput>) {
  group.list.set(group.list.value.filter((item) => item != input));
  saveStorage();
}

/** 设置输入值 */
export function setInputValue<T extends IInput>(
  group: ControlGroup,
  input: WritableAtom<T>,
  value: T["value"]
) {
  input.set({ ...input.value, value });
  group == currentGroup.value &&
    window.dispatchEvent(new FlaquaUpdateEvent(input.value.name, value));
  saveStorage();
}

/** 设置name */
export function setInputName(
  group: ControlGroup,
  input: WritableAtom<IInput>,
  name: string
) {
  input.set({ ...input.value, name });
  group == currentGroup.value &&
    window.dispatchEvent(new FlaquaUpdateEvent(name, input.value.value));
  saveStorage();
}

/** 设置描述 */
export function setInputDesc(
  group: ControlGroup,
  input: WritableAtom<IInput>,
  desc: string
) {
  input.set({ ...input.value, desc });
  saveStorage();
}

/** 生成数据快照 */
export function generateData(list: WritableAtom<IInput>[]) {
  const data: Record<string, any> = {};
  list.forEach((input) => {
    const { name, value } = input.value;
    data[name] = value;
  });
  return data;
}

/** 生成控制快照 */
export function generateSnapshot() {
  return controlStore.value.map((group) => ({
    key: group.key,
    desc: group.desc.value,
    list: group.list.value.map((input) => input.value),
  }));
}

/** 快照生成状态 */
export function buildSnapshot(snapshot: any) {
  controlStore.set(
    snapshot.map((group: any) => ({
      key: group.key,
      desc: atom(group.desc),
      list: atom(group.list.map((input: IInput) => atom(input))),
      show: atom(group.show),
    }))
  );
}

/** 保存数据 */
export function saveStorage() {
  window.localStorage.setItem(
    "flaquaControls",
    JSON.stringify(generateSnapshot())
  );
}

/** 读取数据 */
export function readStorage() {
  const s = window.localStorage.getItem("flaquaControls");
  const g = window.localStorage.getItem("flaquaCurrentGroup");
  if (s) {
    buildSnapshot(JSON.parse(s));
    setCurrentGroup(controlStore.value.find((group) => group.key == g) || null);
  }
}
