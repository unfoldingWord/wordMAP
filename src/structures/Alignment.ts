import Ngram from "./Ngram";

/**
 * Represents two individual n-grams that have been matched from two texts.
 * e.g. from a primary text and secondary text.
 */
export default class Alignment {

  public sourceNgram: Ngram;
  public targetNgram: Ngram;
  private cachedKey!: string; // TRICKY: definite assignment assertion

  /**
   * Returns the n-gram from the source text.
   * @deprecated Consider using {@link sourceNgram} instead since getters have a performance hit.
   * @return {Ngram}
   */
  public get source() {
    return this.sourceNgram;
  }

  /**
   * Returns the n-gram from the target text
   * @deprecated Consider using {@link targetNgram} instead since getters have a performance hit.
   * @return {Ngram}
   */
  public get target() {
    return this.targetNgram;
  }

  /**
   * Returns the alignment key.
   * TODO: would a regular function be faster?
   * @return {string}
   */
  public get key(): string {
    if (this.cachedKey === undefined) {
      this.cachedKey = `${this.sourceNgram.key}->${this.targetNgram.key}`.toLowerCase();
    }
    return this.cachedKey;
  }

  /**
   * Instantiates a new alignment
   * @param {Ngram} sourceNgram - an n-gram from the source text
   * @param {Ngram} targetNgram - an n-gram from the secondary text
   */
  constructor(sourceNgram: Ngram, targetNgram: Ngram) {
    this.sourceNgram = sourceNgram;
    this.targetNgram = targetNgram;
  }
}
