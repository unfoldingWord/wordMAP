import Ngram from "../structures/Ngram";
import FrequencyIndex from "./FrequencyIndex";

/**
 * An index of n-gram frequencies
 */
export default class NgramIndex extends FrequencyIndex {

  /**
   * Reads a value from the index
   * @param ngram - the n-gram index to read. This may be a specific key, or the ngram object to read the default key.
   */
  public read(ngram: Ngram | string): number {
    if (typeof ngram === "string") {
      return this.readIndex(ngram);
    } else {
      return this.readIndex(ngram.key);
    }
  }

  /**
   * Writes a value to the index
   * @deprecated - use {@link increment} instead
   * @param {Ngram} ngram - the n-gram index to write
   * @param {number} value
   */
  public write(ngram: Ngram, value: number) {
    this.writeIndex(ngram.key, value);
  }

  /**
   * Increments the n-gram frequency.
   * This will increment all of the important keys in the n-gram such as
   * the words in question, lemma, etc.
   * @param {Ngram} ngram - the n-gram index to add
   * @param {number} value
   */
  public increment(ngram: Ngram, value: number = 1) {
    this.incrementIndex(ngram.key, value);
    if (ngram.lemmaKey !== undefined) {
      this.incrementIndex(ngram.lemmaKey, value);
    }
  }
}
