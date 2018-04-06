import Alignment from "../structures/Alignment";
import Ngram from "../structures/Ngram";
import Index from "./Index";

/**
 * Represents a store of linguistic data
 */
export default class EngineIndex {

  /**
   * This increments the indexed frequency count for n-grams in the alignment.
   * This method is agnostic to the primary and secondary alignment indices therefore it
   * accepts the n-grams directly rather than the alignment object itself.
   *
   * @param {Index} index - The initial index. This will not be modified directly.
   * @param {Ngram} primaryNgram - the alignments's primary n-gram
   * @param {Ngram} secondaryNgram - the alignment's secondary n-gram
   * @return {Index} a copy of the index with the new data.
   */
  private static indexAlignmentNgrams(index: Index, primaryNgram: Ngram, secondaryNgram: Ngram) {
    const updatedIndex = index.clone();
    const primaryKey: string = primaryNgram.key;
    const secondaryKey: string = secondaryNgram.key;

    let frequency = updatedIndex.read(primaryKey, secondaryKey);
    if (frequency === undefined) {
      frequency = 0;
    }
    updatedIndex.write(frequency + 1, primaryKey, secondaryKey);
    return updatedIndex;
  }

  private primaryAlignmentFrequencyIndexStore: Index;
  private secondaryAlignmentFrequencyIndexStore: Index;
  private primaryNgramFrequencyIndexStore: Index;
  private secondaryNgramFrequencyIndexStore: Index;

  /**
   * Returns the saved alignments index keyed by n-grams in the primary text
   * @return {Index}
   */
  public get primaryAlignmentFrequencyIndex(): Index {
    return this.primaryAlignmentFrequencyIndexStore;
  }

  /**
   * Returns the saved alignments index keyed by n-grams in the secondary text
   * @return {Index}
   */
  public get secondaryAlignmentFrequencyIndex(): Index {
    return this.secondaryAlignmentFrequencyIndexStore;
  }

  /**
   * Returns the n-gram frequency index for n-grams in the primary text
   * @return {Index}
   */
  // public get primaryNgramFrequencyIndex(): Index {
  //   return this.primaryNgramFrequencyIndexStore;
  // }

  /**
   * Returns the n-gram frequency index for n-grams in the secondary text
   * @return {Index}
   */
  // public get secondaryNgramFrequencyIndex(): Index {
  //   return this.secondaryNgramFrequencyIndexStore;
  // }

  constructor() {
    this.primaryAlignmentFrequencyIndexStore = new Index();
    this.secondaryAlignmentFrequencyIndexStore = new Index();
    this.primaryNgramFrequencyIndexStore = new Index();
    this.secondaryNgramFrequencyIndexStore = new Index();
  }

  /**
   * Adds a sentence alignment to the index.
   * @param {Alignment[]} alignments - an array of alignments to add
   */
  public addAlignments(alignments: Alignment[]) {
    for (const alignment of alignments) {
      const source = alignment.source;
      const target = alignment.target;

      // alignment frequency
      this.primaryAlignmentFrequencyIndexStore = EngineIndex.indexAlignmentNgrams(
        this.primaryAlignmentFrequencyIndexStore,
        source,
        target
      );
      this.secondaryAlignmentFrequencyIndexStore = EngineIndex.indexAlignmentNgrams(
        this.secondaryAlignmentFrequencyIndexStore,
        target,
        source
      );

      // frequency of n-grams in the alignments

      // primary n-gram frequency
      let primaryNgramFrequency = this.primaryNgramFrequencyIndexStore.read(
        source.key);
      if (primaryNgramFrequency === undefined) {
        primaryNgramFrequency = 0;
      }
      this.primaryNgramFrequencyIndexStore.write(
        primaryNgramFrequency + 1, source.key);

      // secondary n-gram frequency
      let secondaryNgramFrequency = this.secondaryNgramFrequencyIndexStore.read(
        source.key);
      if (secondaryNgramFrequency === undefined) {
        secondaryNgramFrequency = 0;
      }
      this.secondaryNgramFrequencyIndexStore.write(
        secondaryNgramFrequency + 1, target.key);
    }
  }
}
