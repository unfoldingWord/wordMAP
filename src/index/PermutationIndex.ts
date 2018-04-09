import Alignment from "../structures/Alignment";
import AlignmentIndex from "./AlignmentIndex";
import Index from "./Index";
import NgramIndex from "./NgramIndex";

/**
 * A collection of indexes on the permutation of possible alignments.
 */
export default class PermutationIndex {

  /**
   * Alignment permutation frequency index.
   * The total number of occurrences within the alignment permutations.
   */
  private alignPermFreqIndex: AlignmentIndex;

  /**
   * Source n-gram permutation frequency index.
   * The total number of occurrences within the alignment permutations.
   */
  private srcNgramPermFreqIndex: NgramIndex;

  /**
   * Target n-gram permuation frequency index.
   * The total number of occurrences within the alignment permutations.
   */
  private tgtNgramPermFreqIndex: NgramIndex;

  /**
   * Returns the saved alignments index keyed by n-grams in the primary text
   * @return {Index}
   */
  public get alignmentFrequencyIndex(): AlignmentIndex {
    return this.alignPermFreqIndex;
  }

  public get sourceNgramFrequencyIndex(): NgramIndex {
    return this.srcNgramPermFreqIndex;
  }

  public get targetNgramFrequencyIndex(): NgramIndex {
    return this.tgtNgramPermFreqIndex;
  }

  constructor() {
    this.alignPermFreqIndex = new AlignmentIndex();
    this.srcNgramPermFreqIndex = new NgramIndex();
    this.tgtNgramPermFreqIndex = new NgramIndex();
  }

  /**
   * Adds a sentence alignment to the index.
   * @param {Alignment[]} alignments - an array of alignments to add
   */
  public addAlignments(alignments: Alignment[]) {
    for (const alignment of alignments) {
      // alignment frequency in permutations
      this.alignPermFreqIndex.increment(alignment);

      // TODO: count frequency of n-grams in the linguistic data (NOT the permutations!)
      // we'll count this elsewhere.

      // n-gram frequency in permutations
      this.srcNgramPermFreqIndex.increment(alignment.source);
      this.tgtNgramPermFreqIndex.increment(alignment.target);
    }
  }
}
