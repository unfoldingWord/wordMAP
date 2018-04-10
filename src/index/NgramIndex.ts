import Ngram from "../structures/Ngram";
import FrequencyIndex from "./FrequencyIndex";

/**
 * An index of n-gram frequencies
 */
export default class NgramIndex extends FrequencyIndex {

  /**
   * Reads a value from the index
   * @param ngram - the n-gram index to read
   */
  public read(ngram: Ngram): number {
    return this.readIndex(ngram.key);
  }

  /**
   * Writes a value to the index
   * @param {Ngram} ngram - the n-gram index to write
   * @param {number} value
   */
  public write(ngram: Ngram, value: number) {
    this.writeIndex(ngram.key, value);
  }

  /**
   * Increments a value in the index
   * @param {Ngram} ngram - the n-gram index to add
   * @param {number} value
   */
  public increment(ngram: Ngram, value: number = 1) {
    this.incrementIndex(ngram.key, value);
  }
}
