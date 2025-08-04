/**
 * An index of frequencies
 */
export default abstract class FrequencyIndex {

  private index: Map<string, number>;
  private newCounter: number;
  private totalCount: number;
  private logCountThreshold: number;
  private slowDownThreshold: number;

  constructor() {
    this.index = new Map();
    this.newCounter = 0;
    this.totalCount = 0;
    this.logCountThreshold = 1000000;
    this.slowDownThreshold = 8000000;
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
      this.newCounter++;
      if (this.newCounter > this.logCountThreshold) {
        if (this.totalCount >= this.slowDownThreshold) {
          this.logCountThreshold = 1000;
        }
        this.totalCount += this.newCounter;
        this.newCounter = 0;
        const indexSize = this.index.size;
        console.log(`FrequencyIndex [${this.totalCount}] count threshold reached. Index size: ${indexSize}`);
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
