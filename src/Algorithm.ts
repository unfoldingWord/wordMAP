import AlignmentMemoryIndex from "./index/AlignmentMemoryIndex";
import CorpusIndex from "./index/CorpusIndex";
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
  execute(predictions: Prediction[], cIndex: CorpusIndex, saIndex: AlignmentMemoryIndex, usIndex: UnalignedSentenceIndex): Prediction[];

}
