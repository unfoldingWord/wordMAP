import Engine from "../Engine";
import Parser from "../Parser";
import Token from "../structures/Token";
import PermutationIndex from "./PermutationIndex";
import StaticIndex from "./StaticIndex";

/**
 * A collection of indexes for the corpus.
 */
export default class CorpusIndex {
  private permutationIndex: PermutationIndex;
  private staticIndex: StaticIndex;

  /**
   * Returns an index of permutation metrics.
   */
  get permutations() {
    return this.permutationIndex;
  }

  /**
   * Returns an index of static metrics.
   */
  get static() {
    return this.staticIndex;
  }

  constructor() {
    this.permutationIndex = new PermutationIndex();
    this.staticIndex = new StaticIndex();
  }

  /**
   * Appends sentences to the index.
   * The tokens must contain positional metrics for better accuracy.
   *
   * @param {Token[][]} source
   * @param {Token[][]} target
   */
  public append(source: Token[][], target: Token[][]) {
    if (source.length !== target.length) {
      throw Error("source and target corpus must be the same length");
    } else {
      for (let i = 0; i < source.length; i++) {

        const sourceNgrams = Parser.ngrams(source[i]);
        const targetNgrams = Parser.ngrams(target[i]);

        // index static metrics
        this.staticIndex.addSentence(source[i], target[i], sourceNgrams, targetNgrams);

        // index permutation metrics
        const alignments = Parser.alignments(sourceNgrams, targetNgrams);
        this.permutationIndex.addAlignments(alignments);
      }
    }
  }
}
