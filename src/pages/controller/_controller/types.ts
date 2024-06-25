export interface IInputBase {
  type: string;
  name: string;
  desc: string;
  key: string;
  value: any;
}

export interface IInputText extends IInputBase {
  type: "text";
  value: string;
}

export interface IInputNumber extends IInputBase {
  type: "number";
  value: number;
}

export interface IInputList extends IInputBase {
  type: "list";
  value: string[];
}

export interface IInputToggle extends IInputBase {
  type: "toggle";
  value: boolean;
}

export type IInput = IInputText | IInputNumber | IInputList | IInputToggle;
