import { useContext, useState } from "react";
import type {
  IInput,
  IInputList,
  IInputNumber,
  IInputText,
  IInputToggle,
} from "./types";
import { removeInput, setInputName, setInputValue } from "./store";
import type { WritableAtom } from "nanostores";
import { GroupContext } from "./group";
import { useStore } from "@nanostores/react";

export function InputHeader({ data }: { data: WritableAtom<IInput> }) {
  const group = useContext(GroupContext);
  const { name, desc } = useStore(data);
  const [inputName, setName] = useState(name || "");
  return (
    <div className="control-header">
      <input
        type="text"
        placeholder="[name]"
        onChange={(e) => setName(e.target.value)}
        onBlur={() => setInputName(group, data, inputName)}
        value={inputName}
      />
      <button title={desc}>[i]</button>
      <button onClick={() => removeInput(group, data)}>[x]</button>
    </div>
  );
}

export function InputText({ data }: { data: WritableAtom<IInputText> }) {
  const group = useContext(GroupContext);
  const { value } = useStore(data);
  const [inputValue, setValue] = useState(value || "");
  return (
    <div className="control">
      <InputHeader data={data} />
      <input
        type="text"
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setInputValue(group, data, inputValue)}
        value={inputValue}
      />
    </div>
  );
}

export function InputNumber({ data }: { data: WritableAtom<IInputNumber> }) {
  const group = useContext(GroupContext);
  const { value } = useStore(data);
  const [inputValue, setValue] = useState(value || 0);
  return (
    <div className="control">
      <InputHeader data={data} />
      <input
        type="number"
        onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
        onBlur={() => setInputValue(group, data, inputValue)}
        value={inputValue}
      />
    </div>
  );
}
function InputListItem(props: {
  value: string;
  update: (value: string) => void;
}) {
  const [value, setValue] = useState(props.value);
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={(e) => {
        props.update(e.target.value);
      }}
    />
  );
}
export function InputList({ data }: { data: WritableAtom<IInputList> }) {
  const group = useContext(GroupContext);
  const { value } = useStore(data);
  return (
    <div className="control">
      <div>
        <InputHeader data={data} />
        <button
          onClick={() => {
            setInputValue(group, data, [...value, ""]);
          }}
        >
          [+]
        </button>
        <button
          onClick={() => {
            setInputValue(group, data, value.slice(0, -1));
          }}
        >
          [-]
        </button>
      </div>
      <ul>
        {value.map((item, i) => (
          <li key={i}>
            <InputListItem
              value={item}
              update={(val) => {
                const newValue = [...value];
                newValue[i] = val;
                setInputValue(group, data, newValue);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
export function InputToggle({ data }: { data: WritableAtom<IInputToggle> }) {
  const group = useContext(GroupContext);
  const { value } = useStore(data);
  return (
    <div className="control">
      <InputHeader data={data} />
      <input
        type="checkbox"
        onChange={(e) => setInputValue(group, data, e.currentTarget.checked)}
        checked={value}
      />
    </div>
  );
}

export function InputByType({ data }: { data: WritableAtom<IInput> }) {
  const { type } = useStore(data);
  switch (type) {
    case "text":
      return <InputText data={data as WritableAtom<IInputText>} />;
    case "number":
      return <InputNumber data={data as WritableAtom<IInputNumber>} />;
    case "list":
      return <InputList data={data as WritableAtom<IInputList>} />;
    case "toggle":
      return <InputToggle data={data as WritableAtom<IInputToggle>} />;
  }
}

let count = 0;

export function createInputInfo(type: IInput["type"]): IInput {
  let initValue: any;
  switch (type) {
    case "text":
      initValue = "";
      break;
    case "number":
      initValue = 0;
      break;
    case "list":
      initValue = [];
      break;
    case "toggle":
      initValue = false;
      break;
  }
  const data = {
    type,
    value: initValue,
    name: "",
    desc: "",
    key: `${Date.now()}.${count++}`,
  };
  console.log(data);
  return data;
}
