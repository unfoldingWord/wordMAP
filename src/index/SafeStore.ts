import KeyStore from "./KeyStore";

/**
 * A special container that provides safe I/O operators
 * for a {@link KeyStore}.
 */
export default class SafeStore {

  /**
   * Recursive store reader
   * @param {KeyStore} store - the store to read
   * @param {string[]} keys - an array of keys (the path) to read.
   * @return {any} the value found at the path.
   */
  private static readDeep(store: KeyStore, keys: string[]): any {
    // TODO: iteration would be more efficient
    const nextKey = keys.shift();
    if (nextKey && nextKey in store) {
      return SafeStore.readDeep(store[nextKey], keys);
    } else if (nextKey === undefined) {
      return store;
    } else {
      return undefined;
    }
  }

  /**
   * Recursive store writer.
   * @param {KeyStore} store - the store to write to
   * @param value - the value to write
   * @param {string[]} keys - the key path to write at
   */
  private static writeDeep(store: KeyStore, value: any, keys: string[]) {
    // TODO: iteration would be more efficient
    const nextKey = keys.shift();
    if (!nextKey) {
      return;
    }
    if (keys.length && !(nextKey in store)) {
      store[nextKey] = {};
    }
    if (keys.length) {
      SafeStore.writeDeep(store[nextKey], value, keys);
    } else {
      store[nextKey] = value;
    }
  }

  private keyStore: KeyStore;

  /**
   * Retrieve the underlying store object
   * @return {KeyStore}
   */
  get store() {
    return this.keyStore;
  }

  constructor(initialState?: KeyStore) {
    if (initialState) {
      this.keyStore = Object.assign({}, initialState);
    } else {
      this.keyStore = {};
    }
  }

  /**
   * Returns a deep clone of this store.
   * @return {SafeStore}
   */
  public clone() {
    return new SafeStore(this.keyStore);
  }

  /**
   * Returns the value from the store at the given path
   * @param {string[]} keys - the keys specifying the path to read
   * @return {any} - the value found at the path
   */
  public read(...keys: string[]): any {
    return SafeStore.readDeep(this.keyStore, [...keys]);
  }

  /**
   * Writes a value to the store
   * @param value - the value to write
   * @param {string[]} keys - the keys specifying the path to write
   */
  public write(value: any, ...keys: string[]) {
    SafeStore.writeDeep(this.keyStore, value, [...keys]);
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
