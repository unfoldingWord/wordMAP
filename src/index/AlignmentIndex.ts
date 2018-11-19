import Alignment from "../structures/Alignment";
import FrequencyIndex from "./FrequencyIndex";

/**
 * An index of alignment frequencies
 */
export default class AlignmentIndex extends FrequencyIndex {
  /**
   * Reads a value from the index
   * @param alignment - the alignment index to read. This may be a specific key, or the alignment object to read the default key.
   */
  public read(alignment: Alignment | string): number {
    if (typeof alignment === "string") {
      return this.readIndex(alignment);
    } else {
      return this.readIndex(alignment.key);
    }
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
    // TODO: increment the lemma
  }
}
