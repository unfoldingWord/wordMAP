import {Alignment} from "../core/Alignment";
import {AlignmentIndex} from "./AlignmentIndex";
import {NgramIndex} from "./NgramIndex";

/**
 * A collection of indexes on the permutation of possible alignments.
 */
export class PermutationIndex {

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
   * Returns an index of alignment frequencies in the permutations
   */
  public get alignmentFrequency(): AlignmentIndex {
    return this.alignPermFreqIndex;
  }

  /**
   * Returns an index of source n-gram frequencies in the permutations
   * @return {NgramIndex}
   */
  public get sourceNgramFrequency(): NgramIndex {
    return this.srcNgramPermFreqIndex;
  }

  /**
   * Returns an index of target n-gram frequencies in the permutations
   * @return {NgramIndex}
   */
  public get targetNgramFrequency(): NgramIndex {
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
    for (let i = 0, len = alignments.length; i < len; i++) {
      this.addAlignment(alignments[i]);
    }
  }

  /**
   * Adds a single alignment to the index
   * @param alignment
   */
  public addAlignment(alignment: Alignment) {
    // alignment frequency in permutations
    this.alignPermFreqIndex.increment(alignment);

    // n-gram frequency in permutations
    this.srcNgramPermFreqIndex.increment(alignment.sourceNgram);
    this.tgtNgramPermFreqIndex.increment(alignment.targetNgram);
  }
}
