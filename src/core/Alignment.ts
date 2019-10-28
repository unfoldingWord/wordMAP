import {Ngram} from "./Ngram";

/**
 * Represents two individual n-grams that have been matched from two texts.
 * e.g. from a primary text and secondary text.
 */
export class Alignment {

  public sourceNgram: Ngram;
  public targetNgram: Ngram;
  private cachedKey!: string; // TRICKY: definite assignment assertion
  private cachedLemmaKey: string | undefined;

  /**
   * Returns the n-gram from the source text.
   * @deprecated Consider using {@link sourceNgram} instead since getters have a performance hit.
   * @return {Ngram}
   */
  public get source(): Ngram {
    return this.sourceNgram;
  }

  /**
   * Returns the n-gram from the target text
   * @deprecated Consider using {@link targetNgram} instead since getters have a performance hit.
   * @return {Ngram}
   */
  public get target(): Ngram {
    return this.targetNgram;
  }

  /**
   * Returns the alignment key.
   * TODO: would a regular function be faster?
   * @return {string}
   */
  public get key(): string {
    this.cacheKeys();
    return this.cachedKey;
  }

  /**
   * Returns the alignment lemma-based key
   */
  public get lemmaKey(): string | undefined {
    this.cacheKeys();
    return this.cachedLemmaKey;
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

  /**
   * Outputs the alignment to json
   * @param verbose - print full metadata
   * @return {object}
   */
  public toJSON(verbose: boolean = false): object {
    return {
      sourceNgram: this.sourceNgram.toJSON(verbose),
      targetNgram: this.targetNgram.toJSON(verbose)
    };
  }

  /**
   * Caches the keys if they have not already been generated
   */
  private cacheKeys() {
    if (this.cachedKey === undefined) {
      this.cachedKey = `${this.sourceNgram.key}->${this.targetNgram.key}`;

      // TRICKY: the alignment supports lemma fallback if either language has lemma
      const sourceHasLemma = this.sourceNgram.lemmaKey !== undefined;
      const targetHasLemma = this.targetNgram.lemmaKey !== undefined;
      if (sourceHasLemma || targetHasLemma) {
        const sourceLemma = sourceHasLemma ?
          this.sourceNgram.lemmaKey :
          this.sourceNgram.key;
        const targetLemma = targetHasLemma ?
          this.targetNgram.lemmaKey :
          this.targetNgram.key;
        this.cachedLemmaKey = `${sourceLemma}->${targetLemma}`;
      }
    }
  }
}
