import {Prediction} from "../core/Prediction";
import {AlignmentMemoryIndex} from "../index/AlignmentMemoryIndex";
import {CorpusIndex} from "../index/CorpusIndex";
import {UnalignedSentenceIndex} from "../index/UnalignedSentenceIndex";
import {AlgorithmType} from "./AlgorithmType";

export abstract class Algorithm implements AlgorithmType {
  /**
   * The name of the algorithm
   */
  abstract name: string;

  /**
   * Executes the algorithm
   */
  abstract execute(prediction: Prediction, cIndex: CorpusIndex, saIndex: AlignmentMemoryIndex, usIndex: UnalignedSentenceIndex): Prediction;

}
