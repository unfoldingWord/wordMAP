import EngineIndex from "./index/EngineIndex";
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
  execute(predictions: Prediction[], corpusIndex: EngineIndex, savedAlignmentsIndex: EngineIndex): Prediction[];

}
