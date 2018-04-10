import Engine from "../Engine";
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

  public append(source: Token[][], target: Token[][]) {
    if (source.length !== target.length) {
      throw Error("source and target corpus must be the same length");
    } else {
      for (let i = 0; i < source.length; i++) {
        // measure tokens for positional metrics
        const measuredUnalignedSentencePair: [Token[], Token[]] = [
          Engine.generateMeasuredTokens(source[i]),
          Engine.generateMeasuredTokens(target[i])
        ];

        const sourceNgrams = Engine.generateSentenceNgrams(
          measuredUnalignedSentencePair[0]
        );
        const targetNgrams = Engine.generateSentenceNgrams(
          measuredUnalignedSentencePair[1]
        );

        // index static metrics
        this.staticIndex.addSentence(sourceNgrams, targetNgrams);

        // index permutation metrics
        const alignments = Engine.generateAlignments(
          sourceNgrams,
          targetNgrams
        );
        this.permutationIndex.addAlignments(alignments);
      }
    }
  }
}
