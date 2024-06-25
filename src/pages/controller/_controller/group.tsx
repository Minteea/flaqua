import { InputByType, createInputInfo } from "./input";
import type { IInput } from "./types";
import {
  addInput,
  removeGroup,
  type ControlGroup,
  currentGroup,
  setCurrentGroup,
  setGroupDesc,
} from "./store";
import { type WritableAtom } from "nanostores";
import { createContext, useContext, useState } from "react";
import { useStore } from "@nanostores/react";

export const GroupContext = createContext<ControlGroup>(null);

export function GroupHeader({ group }: { group: ControlGroup }) {
  const desc = useStore(group.desc);
  const show = useStore(group.show);
  const $currentGroup = useStore(currentGroup);
  const [groupDesc, setDesc] = useState(desc || "");
  return (
    <div className="group-header">
      <input
        type="text"
        placeholder="未命名组"
        onChange={(e) => setDesc(e.target.value)}
        onBlur={() => setGroupDesc(group, groupDesc)}
        value={groupDesc}
      />
      <button
        onClick={() => {
          removeGroup(group);
        }}
      >
        移除
      </button>
      <button
        onClick={() => {
          group.show.set(!show);
        }}
      >
        {show ? "隐藏" : "展开"}
      </button>
      <input
        type="checkbox"
        checked={group == $currentGroup}
        onChange={(e) => {
          setCurrentGroup(e.currentTarget.checked ? group : null);
        }}
      />
    </div>
  );
}

export function GroupList({ data }: { data: ControlGroup[] }) {
  return (
    <div className="grouplist">
      {data.map((group) => (
        <Group group={group} key={group.key} />
      ))}
    </div>
  );
}

export function Group({ group }: { group: ControlGroup }) {
  const show = useStore(group.show);
  return (
    <GroupContext.Provider value={group}>
      <div className="group">
        <GroupHeader group={group} />
        <div className="group-content" style={{ display: show ? "" : "none" }}>
          <List list={group.list} />
          <Creator />
        </div>
      </div>
    </GroupContext.Provider>
  );
}

export function List(props: { list: WritableAtom<WritableAtom<IInput>[]> }) {
  const list = useStore(props.list);
  return (
    <div className="list">
      {list.map((item) => {
        return <InputByType data={item} key={item.get().key} />;
      })}
    </div>
  );
}

export function Creator() {
  const group = useContext(GroupContext);
  const [type, setType] = useState<IInput["type"]>("text");
  return (
    <div>
      <select
        value={type}
        onChange={(e) => setType(e.target.value as IInput["type"])}
      >
        <option value="text">文本</option>
        <option value="number">数字</option>
        <option value="list">列表</option>
        <option value="toggle">开关</option>
      </select>
      <button
        onClick={() => {
          addInput(group, createInputInfo(type));
        }}
      >
        添加
      </button>
    </div>
  );
}
