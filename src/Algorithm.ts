import Index from "./index/Index";
import Store from "./index/Store";
import Token from "./structures/Token";

export default interface Algorithm {
  /**
   * The name of the algorithm
   */
  readonly name: string;

  /**
   * Executes the algorithm
   */
  execute(state: Index, corpusIndex: Store, savedAlignmentsIndex: Store, unalignedSentencePair: [Token[], Token[]]): Index;

}
