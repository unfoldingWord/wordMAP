import Algorithm from "../Algorithm";
import Prediction from "../structures/Prediction";

/**
 * Determines the likely hood that an n-gram is a phrase.
 */
export default class CharacterLength extends Algorithm {

  public name = "character length";

  public execute(prediction: Prediction): Prediction {
    let weight = 0;
    // TRICKY: do not score null alignments
    if (!prediction.target.isNull()) {
      // sentence lengths
      const sourceSentenceLength = prediction.source.sentenceCharacterLength;
      const targetSentenceLength = prediction.target.sentenceCharacterLength;

      // n-gram lengths
      const sourceLength = prediction.source.characterLength;
      const targetLength = prediction.target.characterLength;

      const primaryLengthRatio = sourceLength / sourceSentenceLength;
      const secondaryLengthRatio = targetLength / targetSentenceLength;

      // length affinity
      const delta = Math.abs(primaryLengthRatio - secondaryLengthRatio);
      // TRICKY: the power of 5 improves the curve
      weight = Math.pow(1 - delta, 5);
    }
    prediction.setScore("characterLength", weight);
    return prediction;
  }

}
