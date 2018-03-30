/**
 * Describes an object that can be used to store keys and values.
 */
export interface KeyValueIndex {
  [key: string]: any;
}

/**
 * A special container that provides safe I/O operators
 * on a {@link KeyValueIndex}.
 */
export default class Index {

  /**
   * Recursive store reader
   * @param {KeyValueIndex} store - the store to read
   * @param {string[]} keys - an array of keys (the path) to read.
   * @return {any} the value found at the path.
   */
  private static readDeep(store: KeyValueIndex, keys: string[]): any {
    // TODO: iteration would be more efficient
    const nextKey = keys.shift();
    if (nextKey && nextKey in store) {
      return Index.readDeep(store[nextKey], keys);
    } else if (nextKey === undefined) {
      return store;
    } else {
      return undefined;
    }
  }

  /**
   * Recursive store writer.
   * @param {KeyValueIndex} store - the store to write to
   * @param value - the value to write
   * @param {string[]} keys - the key path to write at
   */
  private static writeDeep(store: KeyValueIndex, value: any, keys: string[]) {
    // TODO: iteration would be more efficient
    const nextKey = keys.shift();
    if (!nextKey) {
      return;
    }
    if (keys.length && !(nextKey in store)) {
      store[nextKey] = {};
    }
    if (keys.length) {
      Index.writeDeep(store[nextKey], value, keys);
    } else {
      store[nextKey] = value;
    }
  }

  /**
   * Recursive store appender.
   * @param {KeyValueIndex} store - the store to append to
   * @param {object} value - the value to append
   * @param {string[]} keys - the key path to append at
   */
  private static appendDeep(store: KeyValueIndex, value: object, keys: string[]) {
    // TODO: iteration would be more efficient
    const nextKey = keys.shift();
    if (!nextKey) {
      return;
    }
    if (keys.length && !(nextKey in store)) {
      store[nextKey] = {};
    }
    if (keys.length) {
      Index.writeDeep(store[nextKey], value, keys);
    } else {
      if (typeof store[nextKey] !== "object") {
        throw TypeError(`Cannot append to a store path that is not an object type. Found '${typeof store[nextKey]}'`);
      }

      store[nextKey] = {
        ...store[nextKey],
        ...value
      };
    }
  }

  private keyIndex: KeyValueIndex;

  /**
   * Retrieve the underlying index object
   * @return {KeyValueIndex}
   */
  get index() {
    return this.keyIndex;
  }

  constructor(initialState?: KeyValueIndex) {
    if (initialState) {
      this.keyIndex = Object.assign({}, initialState);
    } else {
      this.keyIndex = {};
    }
  }

  /**
   * Returns a deep clone of this store.
   * @return {Index}
   */
  public clone() {
    return new Index(this.keyIndex);
  }

  /**
   * Returns the value from the store at the given path
   * @param {string[]} keys - the keys specifying the path to read
   * @return {any} - the value found at the path
   */
  public read(...keys: string[]): any {
    return Index.readDeep(this.keyIndex, [...keys]);
  }

  /**
   * Writes a value to the store
   * @param value - the value to write
   * @param {string[]} keys - the keys specifying the path to write
   */
  public write(value: any, ...keys: string[]) {
    Index.writeDeep(this.keyIndex, value, [...keys]);
  }

  /**
   * Appends an object to another object.
   * This is similar to {@link write} except this will not completely clobber the existing value.
   *
   * @param {object} value - the value to append
   * @param {string} keys - the keys specifying the path to append to
   */
  public append(value: object, ...keys: string[]) {
    Index.appendDeep(this.keyIndex, value, [...keys]);
  }

  /**
   * Sums all the integer values at the path
   * @param {string[]} keys - the keys specifying the path to sum
   * @return {number}
   */
  public readSum(...keys: string[]): number {
    const obj = this.read(...keys);
    let sum = 0;
    if (obj && typeof obj === "object") {
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && typeof obj[key] === "number") {
          sum += obj[key];
        }
      }
    } else if (typeof obj === "number") {
      sum += obj;
    }
    return sum;
  }
}
