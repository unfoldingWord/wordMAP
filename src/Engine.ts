import Algorithm from "./Algorithm";
import NotImplemented from "./errors/NotImplemented";
import Store from "./index/Store";
import Index from "./index/Index";
import Alignment from "./structures/Alignment";
import Token from "./structures/Token";

/**
 * Represents a multi-lingual word alignment prediction engine.
 */
export default class Engine {

  private registeredAlgorithms: Algorithm[] = [];
  private corpusStore: Store;
  private savedAlignmentsStore: Store;

  /**
   * Returns a list of algorithms that are registered in the engine
   * @return {Array<Algorithm>}
   */
  get algorithms() {
    return this.registeredAlgorithms;
  }

  constructor() {
    // TODO: read in custom configuration
    this.corpusStore = new Store();
    this.savedAlignmentsStore = new Store();
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
    this.savedAlignmentsStore.addAlignments(savedAlignments);
  }

  /**
   * Runs th engine
   *
   * @param {[Array<Token>]} unalignedSentencePair - The unaligned sentence pair for which alignments will be predicted.
   */
  public run(unalignedSentencePair: [Token[], Token[]]): Alignment[] {
    let state = new Index();
    for (const algorithm of this.registeredAlgorithms) {
      state = algorithm.execute(state, this.corpusStore,
        this.savedAlignmentsStore, unalignedSentencePair
      );
    }
    return [];
  }
}
