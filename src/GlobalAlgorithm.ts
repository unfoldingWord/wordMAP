import AlgorithmInterface from "./AlgorithmInterface";
import AlignmentMemoryIndex from "./index/AlignmentMemoryIndex";
import CorpusIndex from "./index/CorpusIndex";
import UnalignedSentenceIndex from "./index/UnalignedSentenceIndex";
import Prediction from "./structures/Prediction";

export default abstract class GlobalAlgorithm implements AlgorithmInterface {
  /**
   * The name of the algorithm
   */
  abstract name: string;

  /**
   * Executes the algorithm
   */
  abstract execute(predictions: Prediction[], cIndex: CorpusIndex, saIndex: AlignmentMemoryIndex, usIndex: UnalignedSentenceIndex): Prediction[];

}
