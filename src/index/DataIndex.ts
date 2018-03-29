import NotImplemented from "../errors/NotImplemented";
import Alignment from "../structures/Alignment";
import Ngram from "../structures/Ngram";
import Token from "../structures/Token";
import SafeStore from "./SafeStore";

/**
 * Represents an index of linguistic data
 */
export default class DataIndex {

  /**
   * Returns the alignment frequency found in the index.
   * @param {SafeStore} index - the index of alignment frequencies
   * @param {Ngram} primaryNgram - the primary text n-gram
   * @param {Ngram} secondaryNgram - the secondary text n-gram
   * @return {number}
   */
  public static getAlignmentFrequency(index: SafeStore, primaryNgram: Ngram, secondaryNgram: Ngram) {
    const primaryKey = primaryNgram.toString();
    const secondaryKey = secondaryNgram.toString();
    const frequency = index.read(primaryKey, secondaryKey);
    if (frequency !== undefined) {
      return frequency;
    } else {
      return 0;
    }
  }

  /**
   * This increments the indexed frequency count for n-grams in the alignment.
   * This method is agnostic to the primary and secondary alignment indices therefore it
   * accepts the n-grams directly rather than the alignment object itself.
   *
   * @param {SafeStore} index - The initial index. This will not be modified directly.
   * @param {Ngram} primaryNgram - the alignments's primary n-gram
   * @param {Ngram} secondaryNgram - the alignment's secondary n-gram
   * @return {SafeStore} a copy of the index with the new data.
   */
  private static indexAlignmentNgrams(index: SafeStore, primaryNgram: Ngram, secondaryNgram: Ngram) {
    const updatedIndex = index.clone();
    const primaryKey: string = primaryNgram.toString();
    const secondaryKey: string = secondaryNgram.toString();

    let frequency = updatedIndex.read(primaryKey, secondaryKey);
    if (frequency === undefined) {
      frequency = 0;
    }
    updatedIndex.write(frequency + 1, primaryKey, secondaryKey);
    return updatedIndex;
  }

  private primaryAlignmentFrequencyIndexStore: SafeStore;
  private secondaryAlignmentFrequencyIndexStore: SafeStore;
  private primaryNgramFrequencyIndexStore: SafeStore;
  private secondaryNgramFrequencyIndexStore: SafeStore;

  /**
   * Returns the saved alignments index keyed by n-grams in the primary text
   * @return {SafeStore}
   */
  public get primaryAlignmentFrequencyIndex(): SafeStore {
    return this.primaryAlignmentFrequencyIndexStore;
  }

  /**
   * Returns the saved alignments index keyed by n-grams in the secondary text
   * @return {SafeStore}
   */
  public get secondaryAlignmentFrequencyIndex(): SafeStore {
    return this.secondaryAlignmentFrequencyIndexStore;
  }

  /**
   * Returns the n-gram frequency index for n-grams in the primary text
   * @return {SafeStore}
   */
  public get primaryNgramFrequencyIndex(): SafeStore {
    return this.primaryNgramFrequencyIndexStore;
  }

  /**
   * Returns the n-gram frequency index for n-grams in the secondary text
   * @return {SafeStore}
   */
  public get secondaryNgramFrequencyIndex(): SafeStore {
    return this.secondaryNgramFrequencyIndexStore;
  }

  constructor() {
    this.primaryAlignmentFrequencyIndexStore = new SafeStore();
    this.secondaryAlignmentFrequencyIndexStore = new SafeStore();
    this.primaryNgramFrequencyIndexStore = new SafeStore();
    this.secondaryNgramFrequencyIndexStore = new SafeStore();
  }

  /**
   * Returns the alignment frequency found in the primary index
   * @param {Ngram} primaryNgram
   * @param {Ngram} secondaryNgram
   * @return {number}
   */
  public getPrimaryAlignmentFrequency(primaryNgram: Ngram, secondaryNgram: Ngram) {
    return DataIndex.getAlignmentFrequency(
      this.primaryAlignmentFrequencyIndexStore,
      primaryNgram,
      secondaryNgram
    );
  }

  /**
   * Returns the alignment frequency found in the secondary index
   *
   * @param {Ngram} primaryNgram
   * @param {Ngram} secondaryNgram
   * @return {number}
   */
  public getSecondaryAlignmentFrequency(primaryNgram: Ngram, secondaryNgram: Ngram) {
    return DataIndex.getAlignmentFrequency(
      this.secondaryAlignmentFrequencyIndexStore,
      secondaryNgram,
      primaryNgram
    );
  }

  /**
   * This will be used to append sentence pairs to the index.
   * @param {[Array<Token>]} sentencePair
   */
  public addSentencePair(sentencePair: [Token[], Token[]]) {
    throw new NotImplemented();
  }

  public addAlignments(alignments: Alignment[]) {
    for (const alignment of alignments) {
      const source = alignment.source;
      const target = alignment.target;

      // index the alignment frequency
      this.primaryAlignmentFrequencyIndexStore = DataIndex.indexAlignmentNgrams(
        this.primaryAlignmentFrequencyIndexStore,
        source,
        target
      );
      this.secondaryAlignmentFrequencyIndexStore = DataIndex.indexAlignmentNgrams(
        this.secondaryAlignmentFrequencyIndexStore,
        target,
        source
      );

      // TODO: index the n-gram frequency
    }
  }
}
