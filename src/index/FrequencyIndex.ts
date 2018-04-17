import NumberObject from "./NumberObject";

/**
 * An index of frequencies
 */
export default abstract class FrequencyIndex {

  private index: NumberObject;

  constructor() {
    this.index = {};
  }

  /**
   * Reads a value from the index.
   * If the key does not exist the result will be 0.
   * @param {string} key
   */
  protected readIndex(key: string): number {
    const lowerKey = key.toLowerCase();
    if (lowerKey in this.index) {
      return this.index[lowerKey];
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
    if (isNaN(value)) {
      throw new Error(`Invalid NaN frequency for "${key}"`);
    }
    const lowerKey = key.toLowerCase();
    const originalValue = this.readIndex(lowerKey);
    this.index[lowerKey] = originalValue + value;
  }

  /**
   * Manually writes a value to the index
   * @deprecated use {@link incrementIndex} instead.
   * @param {string} key
   * @param {number} value
   */
  protected writeIndex(key: string, value: number) {
    this.index[key] = value;
  }
}
