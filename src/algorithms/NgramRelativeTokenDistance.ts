import {Prediction} from "../core/Prediction";
import {AlignmentMemoryIndex} from "../index/AlignmentMemoryIndex";
import {CorpusIndex} from "../index/CorpusIndex";
import {UnalignedSentenceIndex} from "../index/UnalignedSentenceIndex";
import {Algorithm} from "./Algorithm";

/**
 * This algorithm calculates the relative distance between tokens within an n-gram.
 * NOTE: this algorithm is only useful for dis-contiguous n-grams.
 *
 * Some words that are textually identical but have different occurrences may
 * be falsely suggested with a word farther away within the sentence.
 *
 * This algorithm can be used to correct those false positives.
 * Results range from 0 to 1.
 */
export class NgramRelativeTokenDistance extends Algorithm {

  /**
   * Calculates the relative distance between positions.
   * A score of 0 means the tokens are on opposite sides of the sentence.
   * A score of 1 means they are next to each other.
   * @param t length of sentence
   * @param x first position
   * @param y second position
   */
  public static calculate(t: number, x: number, y: number): number {
    // calculate distance between positions. abs(x-y) - 1
    const d = Math.abs(x - y) - 1;

    // calculate maximum distance. abs(0-T-1)-1. or just T-2.
    const maxD = t - 2;

    // calculate distance ratio
    const r = d / maxD;

    // invert to get score
    return 1 - r;
  }

  public name = "alignment relative occurrence";

  public execute(prediction: Prediction, cIndex: CorpusIndex, saIndex: AlignmentMemoryIndex, usIndex: UnalignedSentenceIndex): Prediction {
    // TRICKY: do not score null alignments
    if (prediction.target.isNull()) {
      return prediction;
    }

    const targetLength = prediction.target.tokenLength;

    // TRICKY: this algorithm only applies to bi-grams or larger
    if (targetLength < 2) {
      return prediction;
    }

    // get the target sentence token length
    const t = usIndex.static.targetTokenLength;

    // score each contiguous pair of tokens within the ngram
    let worstScore = 1;
    for (let i = 0; i < targetLength - 1; i++) {
      const x = prediction.target.getTokens()[i];
      const y = prediction.target.getTokens()[i + 1];
      const score = NgramRelativeTokenDistance.calculate(
        t,
        x.position,
        y.position
      );
      if (score < worstScore) {
        worstScore = score;
      }
    }

    prediction.setScore("ngramRelativeTokenDistance", worstScore);
    return prediction;
  }
}
