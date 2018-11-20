import Algorithm from "../Algorithm";
import AlignmentMemoryIndex from "../index/AlignmentMemoryIndex";
import CorpusIndex from "../index/CorpusIndex";
import UnalignedSentenceIndex from "../index/UnalignedSentenceIndex";
import Prediction from "../structures/Prediction";

/**
 * A commonly seen pattern in translation is that word repetition in the primary text
 * is often seen in the secondary text.
 */
export default class AlignmentOccurrences implements Algorithm {

  /**
   * Calculates the
   * @param sourceNgramFrequency
   * @param targetNgramFrequency
   */
  public static calc(sourceNgramFrequency: number, targetNgramFrequency: number) {
    if (sourceNgramFrequency === 0 || targetNgramFrequency === 0) {
      return 0;
    } else {
      return Math.min(sourceNgramFrequency, targetNgramFrequency) /
        Math.max(sourceNgramFrequency, targetNgramFrequency);
      // TODO: Review above change with Klappy
      // const delta = Math.abs(sourceNgramFrequency - targetNgramFrequency);
      // return 1 / (delta + 1);
    }
  }

  /**
   * Calculates the weight based on the word
   * @param p
   * @param usIndex
   */
  private static calcOccurrenceSimilarity(p: Prediction, usIndex: UnalignedSentenceIndex) {
    const sourceFrequency = usIndex.static.sourceNgramFrequency.read(p.source);
    const targetFrequency = usIndex.static.targetNgramFrequency.read(p.target);
    const weight = AlignmentOccurrences.calc(sourceFrequency, targetFrequency);
    p.setScore("alignmentOccurrences", weight);
  }

  /**
   * Calculates the weight based on the lemma
   * @param p
   * @param usIndex
   */
  private static calcLemmaOccurrenceSimilarity(p: Prediction, usIndex: UnalignedSentenceIndex) {
    if (p.source.lemmaKey !== undefined && p.target.lemmaKey !== undefined) {
      const sourceFrequency = usIndex.static.sourceNgramFrequency.read(p.source.lemmaKey);
      const targetFrequency = usIndex.static.targetNgramFrequency.read(p.target.lemmaKey);
      const weight = AlignmentOccurrences.calc(
        sourceFrequency,
        targetFrequency
      );
      p.setScore("lemmaAlignmentOccurrences", weight);
    }
  }

  public name = "alignment occurrences";

  public execute(predictions: Prediction[], cIndex: CorpusIndex, saIndex: AlignmentMemoryIndex, usIndex: UnalignedSentenceIndex): Prediction[] {
    for (const p of predictions) {
      AlignmentOccurrences.calcOccurrenceSimilarity(p, usIndex);
      AlignmentOccurrences.calcLemmaOccurrenceSimilarity(p, usIndex);
    }
    return predictions;
  }
}
