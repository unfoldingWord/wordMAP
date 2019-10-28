import {Token} from "wordmap-lexer";
import {Parser} from "../core/Parser";
import {PermutationIndex} from "./PermutationIndex";
import {StaticIndex} from "./StaticIndex";

/**
 * A collection of indexes for the corpus.
 */
export class CorpusIndex {
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
   * @param maxSourceNgramLength
   * @param maxTargetNgramLength
   */
  public append(source: Token[][], target: Token[][], maxSourceNgramLength: number, maxTargetNgramLength: number) {
    const sourceLength = source.length;
    if (sourceLength !== target.length) {
      throw Error("source and target corpus must be the same length");
    } else {
      for (let i = 0; i < sourceLength; i++) {
        const sourceToken = source[i];
        const targetToken = target[i];

        const sourceNgrams = Parser.ngrams(sourceToken, maxSourceNgramLength);
        const targetNgrams = Parser.ngrams(targetToken, maxTargetNgramLength);

        // index static metrics
        this.staticIndex.addSentence(
          sourceToken,
          targetToken,
          sourceNgrams,
          targetNgrams
        );

        // index permutation metrics
        Parser.indexAlignmentPermutations(
          sourceNgrams,
          targetNgrams,
          this.permutationIndex
        );
      }
    }
  }
}
