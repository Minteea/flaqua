/** @jsxImportSource react */

import { addGroup, controlStore } from "./store";
import { Creator, GroupList, List } from "./group.react";
import { useStore } from "@nanostores/react";

export default function Controller() {
  const data = useStore(controlStore);
  return (
    <div className="controller">
      <button
        onClick={() => {
          addGroup([]);
        }}
      >
        添加组
      </button>
      <GroupList data={data} />
    </div>
  );
}
