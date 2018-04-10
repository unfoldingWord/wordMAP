import CorpusIndex from "./index/CorpusIndex";
import SavedAlignmentsIndex from "./index/SavedAlignmentsIndex";
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
  execute(predictions: Prediction[], cIndex: CorpusIndex, saIndex: SavedAlignmentsIndex, sourceSentence: Token[], targetSentence: Token[]): Prediction[];

}
