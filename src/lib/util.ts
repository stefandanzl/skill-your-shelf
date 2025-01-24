function onSave() {}
//@ts-ignore
export function preventDefault(fn) {
  //@ts-ignore
  return function (event) {
    event.preventDefault();
    //@ts-ignore
    fn.call(this, event);
  };
}
