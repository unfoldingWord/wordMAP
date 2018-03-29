import NotImplemented from "./errors/NotImplemented";
import KeyStore from "./interfaces/KeyStore";
import Alignment from "./structures/Alignment";
import Ngram from "./structures/Ngram";
import Token from "./structures/Token";

/**
 * Represents an index of linguistic data
 */
export default class DataIndex {

  /**
   * Returns the alignment frequency found in the index.
   * @param {KeyStore} index - the index of alignment frequencies
   * @param {Ngram} primaryNgram - the primary text n-gram
   * @param {Ngram} secondaryNgram - the secondary text n-gram
   * @return {number}
   */
  private static getAlignmentFrequency(
    index: KeyStore, primaryNgram: Ngram, secondaryNgram: Ngram) {
    const primaryKey = primaryNgram.toString();
    const secondaryKey = secondaryNgram.toString();
    if (primaryKey in index && secondaryKey in index[primaryKey]) {
      return index[primaryKey][secondaryKey];
    } else {
      return 0;
    }
  }

  /**
   * This increments the indexed frequency count for n-grams in the alignment.
   * This method is agnostic to the primary and secondary alignment indices therefore it
   * accepts the n-grams directly rather than the alignment object itself.
   *
   * @param {KeyStore} index - The initial index. This will not be modified directly.
   * @param {Ngram} primaryNgram - the alignments's primary n-gram
   * @param {Ngram} secondaryNgram - the alignment's secondary n-gram
   * @return {KeyStore} a copy of the index with the new data.
   */
  private static indexAlignmentNgrams(
    index: KeyStore, primaryNgram: Ngram, secondaryNgram: Ngram) {
    const updatedIndex = Object.assign({}, index);
    const primaryKey: string = primaryNgram.toString();
    const secondaryKey: string = secondaryNgram.toString();

    if (!(primaryKey in updatedIndex)) {
      updatedIndex[primaryKey] = {};
    }
    if (!(secondaryKey in updatedIndex[primaryKey])) {
      updatedIndex[primaryKey][secondaryKey] = 0;
    }
    updatedIndex[primaryKey][secondaryKey] += 1;
    return updatedIndex;
  }

  private primaryAlignmentFrequencyIndexStore: KeyStore = {};
  private secondaryAlignmentFrequencyIndexStore: KeyStore = {};

  /**
   * Returns the saved alignments index keyed by n-grams in the primary text
   * @return {KeyStore}
   */
  public get primaryAlignmentFrequencyIndex(): KeyStore {
    return this.primaryAlignmentFrequencyIndexStore;
  }

  /**
   * Returns the saved alignments index keyed by n-grams in the secondary text
   * @return {KeyStore}
   */
  public get secondaryAlignmentFrequencyIndex(): KeyStore {
    return this.secondaryAlignmentFrequencyIndexStore;
  }

  /**
   * Returns the n-gram frequency index for n-grams in the primary text
   * @return {KeyStore}
   */
  public get primaryNgramFrequencyIndex(): KeyStore {
    return {};
  }

  /**
   * Returns the n-gram frequency index for n-grams in the secondary text
   * @return {KeyStore}
   */
  public get secondaryNgramFrequencyIndex(): KeyStore {
    return {};
  }

  /**
   * Returns the alignment frequency found in the primary index
   * @param {Ngram} primaryNgram
   * @param {Ngram} secondaryNgram
   * @return {number}
   */
  public getPrimaryAlignmentFrequency(
    primaryNgram: Ngram, secondaryNgram: Ngram) {
    return DataIndex.getAlignmentFrequency(this.primaryAlignmentFrequencyIndexStore,
      primaryNgram, secondaryNgram,
    );
  }

  /**
   * Returns the alignment frequency found in the secondary index
   *
   * @param {Ngram} primaryNgram
   * @param {Ngram} secondaryNgram
   * @return {number}
   */
  public getSecondaryAlignmentFrequency(
    primaryNgram: Ngram, secondaryNgram: Ngram) {
    return DataIndex.getAlignmentFrequency(
      this.secondaryAlignmentFrequencyIndexStore, secondaryNgram, primaryNgram);
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
        this.primaryAlignmentFrequencyIndexStore, source, target);
      this.secondaryAlignmentFrequencyIndexStore = DataIndex.indexAlignmentNgrams(
        this.secondaryAlignmentFrequencyIndexStore, target, source);

      // TODO: index the n-gram frequency
    }
  }
}
