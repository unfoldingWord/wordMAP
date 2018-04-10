import Engine from "../Engine";
import Token from "../structures/Token";
import NgramIndex from "./NgramIndex";
import PermutationIndex from "./PermutationIndex";

/**
 * A collection of indexes for the corpus.
 */
export default class CorpusIndex {
  private srcNgramFreqIndex: NgramIndex;
  private tgtNgramFreqIndex: NgramIndex;
  private permutationIndex: PermutationIndex;

  /**
   * Returns an index of permutations
   * @return {PermutationIndex}
   */
  get permutations() {
    return this.permutationIndex;
  }

  /**
   * Returns an index of source n-gram frequencies
   * @return {NgramIndex}
   */
  get sourceNgramFrequency() {
    return this.srcNgramFreqIndex;
  }

  /**
   * Returns an index of target n-gram frequencies
   * @return {NgramIndex}
   */
  get targetNgramFrequency() {
    return this.tgtNgramFreqIndex;
  }

  constructor() {
    this.permutationIndex = new PermutationIndex();
    this.srcNgramFreqIndex = new NgramIndex();
    this.tgtNgramFreqIndex = new NgramIndex();
  }

  public append(source: Token[][], target: Token[][]) {
    if (source.length !== target.length) {
      throw Error("source and target corpus must be the same length");
    } else {
      for (let i = 0; i < source.length; i++) {
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

        // index corpus n-gram frequencies
        for (const ngram of sourceNgrams) {
          this.srcNgramFreqIndex.increment(ngram);
        }
        for (const ngram of targetNgrams) {
          this.tgtNgramFreqIndex.increment(ngram);
        }

        // index permutations
        const alignments = Engine.generateAlignments(
          sourceNgrams,
          targetNgrams
        );
        this.permutationIndex.addAlignments(alignments);
      }
    }
  }
}
