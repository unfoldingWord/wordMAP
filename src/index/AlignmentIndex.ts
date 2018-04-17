import Alignment from "../structures/Alignment";
import FrequencyIndex from "./FrequencyIndex";

/**
 * An index of alignment frequencies
 */
export default class AlignmentIndex extends FrequencyIndex {
  /**
   * Reads a value from the index
   * @param alignment
   */
  public read(alignment: Alignment): number {
    return this.readIndex(alignment.key);
  }

  /**
   * Writes a value to the index
   * @deprecated - use {@link increment} instead
   * @param {Alignment} alignment
   * @param {number} value
   */
  public write(alignment: Alignment, value: number) {
    this.writeIndex(alignment.key, value);
  }

  /**
   * Increments a value in the index
   * @param {Alignment} alignment
   * @param {number} value
   */
  public increment(alignment: Alignment, value: number = 1) {
    this.incrementIndex(alignment.key, value);
  }
}
