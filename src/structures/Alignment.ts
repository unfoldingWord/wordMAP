import Ngram from "./Ngram";

/**
 * Represents two individual n-grams that have been matched from two texts.
 * e.g. from a primary text and secondary text.
 */
export default class Alignment {

  private sourceNgram: Ngram;
  private targetNgram: Ngram;

  /**
   * Returns the n-gram from the source text
   * @return {Ngram}
   */
  public get source() {
    return this.sourceNgram;
  }

  /**
   * Returns the n-gram from the target text
   * @return {Ngram}
   */
  public get target() {
    return this.targetNgram;
  }

  /**
   * @param {Ngram} sourceNgram - an n-gram from the source text
   * @param {Ngram} targetNgram - an n-gram from the secondary text
   */
  constructor(sourceNgram: Ngram, targetNgram: Ngram) {
    this.sourceNgram = sourceNgram;
    this.targetNgram = targetNgram;
  }

  public toString(): string {
    return `${this.sourceNgram.toString()}->${this.targetNgram.toString()}`;
  }
}
