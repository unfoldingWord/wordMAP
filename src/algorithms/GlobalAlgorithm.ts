import {Prediction} from "../core/";
import {
  AlignmentMemoryIndex,
  CorpusIndex,
  UnalignedSentenceIndex
} from "../index/";
import {AlgorithmType} from "./";

export abstract class GlobalAlgorithm implements AlgorithmType {
  /**
   * The name of the algorithm
   */
  abstract name: string;

  /**
   * Executes the algorithm
   */
  abstract execute(predictions: Prediction[], cIndex: CorpusIndex, saIndex: AlignmentMemoryIndex, usIndex: UnalignedSentenceIndex): Prediction[];

}
