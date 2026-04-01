import { atom, type WritableAtom } from "nanostores";

/** 带默认值的atom，若设为空值，则使用默认值 */
export function autoDefaultAtom<T>(defaultValue: T): WritableAtom<T> {
  let $atom = atom(defaultValue);
  const setAtom = $atom.set;
  $atom.set = (newValue: T | null) => {
    setAtom(newValue ?? defaultValue);
  };
  return $atom;
}
