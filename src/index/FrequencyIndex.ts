/**
 * An index of frequencies
 */
export abstract class FrequencyIndex {

  private index: Map<string, number>;

  constructor() {
    this.index = new Map();
  }

  /**
   * Reads a value from the index.
   * If the key does not exist the result will be 0.
   * @param {string} key
   */
  protected readIndex(key: string): number {
    const val = this.index.get(key);
    if (val !== undefined) {
      return val;
    } else {
      return 0;
    }
  }

  /**
   * Adds a number to the key's value.
   * If no number is given the default amount will be added to the value.
   * @param key
   * @param value - optional value to add
   */
  protected incrementIndex(key: string, value: number = 1) {
    const originalValue = this.readIndex(key);
    this.index.set(key, originalValue + value);
  }

  /**
   * Manually writes a value to the index
   * @deprecated use {@link incrementIndex} instead.
   * @param {string} key
   * @param {number} value
   */
  protected writeIndex(key: string, value: number) {
    this.index.set(key, value);
  }
}
