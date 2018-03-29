import DataIndex from "../DataIndex";
import Token from "../structures/Token";
import KeyStore from "./KeyStore";

export default interface Algorithm {
  /**
   * The name of the algorithm
   */
  readonly name: string;

  /**
   * Executes the algorithm
   */
  execute(
    state: KeyStore, corpusIndex: DataIndex, savedAlignmentsIndex: DataIndex,
    unalignedSentencePair: [Token[], Token[]]): KeyStore;

}
