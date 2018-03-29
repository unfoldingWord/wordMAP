import DataIndex from "./DataIndex";
import NotImplemented from "./errors/NotImplemented";
import Algorithm from "./interfaces/Algorithm";
import KeyStore from "./interfaces/KeyStore";
import Alignment from "./structures/Alignment";
import Token from "./structures/Token";

/**
 * Represents a multi-lingual word alignment prediction engine.
 */
export default class Engine {

  private registeredAlgorithms: Algorithm[] = [];
  private corpusIndex: DataIndex;
  private savedAlignmentsIndex: DataIndex;

  /**
   * Returns a list of algorithms that are registered in the engine
   * @return {Array<Algorithm>}
   */
  get algorithms() {
    return this.registeredAlgorithms;
  }

  constructor() {
    // TODO: read in custom configuration
    this.corpusIndex = new DataIndex();
    this.savedAlignmentsIndex = new DataIndex();
  }

  /**
   * Adds a new algorithm to the engine.
   * @param {Algorithm} algorithm - the algorithm to run with the engine.
   */
  public registerAlgorithm(algorithm: Algorithm): void {
    this.registeredAlgorithms.push(algorithm);
  }

  public addCorpus() {
    throw new NotImplemented();
  }

  /**
   * Appends new saved alignments to the engine.
   * Adding saved alignments improves the quality of predictions.
   * @param {Array<Alignment>} savedAlignments - a list of alignments
   */
  public addAlignments(savedAlignments: Alignment[]) {
    this.savedAlignmentsIndex.addAlignments(savedAlignments);
  }

  /**
   * Runs th engine
   *
   * @param {[Array<Token>]} unalignedSentencePair - The unaligned sentence pair for which alignments will be predicted.
   */
  public run(unalignedSentencePair: [Token[], Token[]]) {
    let state: KeyStore = {};
    for (const algorithm of this.registeredAlgorithms) {
      state = algorithm.execute(state, this.corpusIndex,
        this.savedAlignmentsIndex, unalignedSentencePair,
      );
    }
  }
}
