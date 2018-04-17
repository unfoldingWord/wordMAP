import CorpusIndex from "./index/CorpusIndex";
import SavedAlignmentsIndex from "./index/SavedAlignmentsIndex";
import UnalignedSentenceIndex from "./index/UnalignedSentenceIndex";
import Prediction from "./structures/Prediction";

export default interface Algorithm {
  /**
   * The name of the algorithm
   */
  readonly name: string;

  /**
   * Executes the algorithm
   */
  execute(predictions: Prediction[], cIndex: CorpusIndex, saIndex: SavedAlignmentsIndex, usIndex: UnalignedSentenceIndex): Prediction[];

}
