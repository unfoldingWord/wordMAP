import Algorithm from "../Algorithm";
import Prediction from "../structures/Prediction";

/**
 * Determines the likely hood that an n-gram is a phrase.
 */
export default class CharacterLength implements Algorithm {

  public name = "character length";

  public execute(predictions: Prediction[]): Prediction[] {
    for (const p of predictions) {
      let weight = 0;
      // TRICKY: do not score null alignments
      if (!p.alignment.target.isNull()) {
        // sentence lengths
        const sourceSentenceLength = p.alignment.source.sentenceCharacterLength;
        const targetSentenceLength = p.alignment.target.sentenceCharacterLength;

        // n-gram lengths
        const sourceLength = p.alignment.source.characterLength;
        const targetLength = p.alignment.target.characterLength;

        const primaryLengthRatio = sourceLength / sourceSentenceLength;
        const secondaryLengthRatio = targetLength / targetSentenceLength;

        // length affinity
        const delta = Math.abs(primaryLengthRatio - secondaryLengthRatio);
        // TRICKY: the power of 5 improves the curve
        weight = Math.pow(1 - delta, 5);
      }
      p.setScore("characterLength", weight);
    }
    return predictions;
  }

}
