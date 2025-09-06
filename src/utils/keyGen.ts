export default class UniqueKeyGenerator {
  private _counter = 0;
  private _keyMap: WeakMap<Record<string, any>, string>;

  constructor() {
    this._counter = 0;
    this._keyMap = new WeakMap();
  }

  public generate(obj: Record<string, any>) {
    if (this._keyMap.has(obj)) {
      return this._keyMap.get(obj);
    }

    const key = `uk-${this._counter++}`;
    this._keyMap.set(obj, key);

    return key;
  }
}