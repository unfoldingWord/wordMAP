import Index from "./index/Index";
import Store from "./index/Store";
import Prediction from "./structures/Prediction";
import Token from "./structures/Token";

export default interface Algorithm {
  /**
   * The name of the algorithm
   */
  readonly name: string;

  /**
   * Executes the algorithm
   */
  execute(predictions: Prediction[], corpusIndex: Store, savedAlignmentsIndex: Store, unalignedSentencePair: [Token[], Token[]]): Prediction[];

}
