const newCountThreshold: number = 100000;

/**
 * An index of frequencies
 */
export default abstract class FrequencyIndex {

  private index: { [key: string]: number };
  private newCounter: number;
  private superCount: number;

  constructor() {
    this.index = {};
    this.newCounter = 0;
    this.superCount = 0;
  }

  /**
   * Reads a value from the index.
   * If the key does not exist the result will be 0.
   * @param {string} key
   */
  protected readIndex(key: string): number {
    const val = this.index[key];
    if (val !== undefined) {
      return val;
    } else {
      this.newCounter++;
      if (this.newCounter > newCountThreshold) {
        this.superCount++;
        this.newCounter = 0;
        const indexSize = Object.keys(this.index).length;
        console.log(`FrequencyIndex [${this.superCount *
        newCountThreshold}] count threshold reached. Index size: ${indexSize}`);
      }
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
    this.index[key] = originalValue + value;
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
