import Alignment from "../structures/Alignment";
import FrequencyIndex from "./FrequencyIndex";

/**
 * An index of alignment frequencies
 */
export default class AlignmentIndex extends FrequencyIndex {
  private static makeKey(alignment: Alignment): string {
    return `${alignment.source.key}->${alignment.target.key}`;
  }

  /**
   * Reads a value from the index
   * @param alignment
   */
  public read(alignment: Alignment): number {
    const key = AlignmentIndex.makeKey(alignment);
    return this.readIndex(key);
  }

  /**
   * Writes a value to the index
   * @param {Alignment} alignment
   * @param {number} value
   */
  public write(alignment: Alignment, value: number) {
    const key = AlignmentIndex.makeKey(alignment);
    this.writeIndex(key, value);
  }

  /**
   * Increments a value in the index
   * @param {Alignment} alignment
   * @param {number} value
   */
  public increment(alignment: Alignment, value: number = 1) {
    const key = AlignmentIndex.makeKey(alignment);
    this.incrementIndex(key, value);
  }
}
