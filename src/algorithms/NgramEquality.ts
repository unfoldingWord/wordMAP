import {Prediction} from "../core/Prediction";
import {AlignmentMemoryIndex} from "../index/AlignmentMemoryIndex";
import {CorpusIndex} from "../index/CorpusIndex";
import {Algorithm} from "./Algorithm";

/**
 * Calculations the equivalence of the target n-gram with the source n-gram.
 * This is primarily useful when aligning texts within the same language.
 * e.g. to uncover variations within the text such as spelling and word order.
 */
export class NgramEquality extends Algorithm {
  public name: string = "n-gram equality";

  /**
   * Load data into the predictions
   * @param predictions
   * @param cIndex
   * @param saIndex
   * @param usIndex
   */
  public execute(prediction: Prediction, cIndex: CorpusIndex, saIndex: AlignmentMemoryIndex, usIndex: CorpusIndex): Prediction {
    // TODO: implement algorithm.
    // compare text
    // compare lemma
    // using Levenstein's distance for comparisons https://www.npmjs.com/package/levenshtein
    return prediction;
  }
}
