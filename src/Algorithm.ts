import DataIndex from "./index/DataIndex";
import SafeStore from "./index/SafeStore";
import Token from "./structures/Token";

export default interface Algorithm {
  /**
   * The name of the algorithm
   */
  readonly name: string;

  /**
   * Executes the algorithm
   */
  execute(state: SafeStore, corpusIndex: DataIndex, savedAlignmentsIndex: DataIndex, unalignedSentencePair: [Token[], Token[]]): SafeStore;

}
