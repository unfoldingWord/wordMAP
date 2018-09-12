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
  public name = "alignment occurrences";

  public execute(predictions: Prediction[], cIndex: CorpusIndex, saIndex: AlignmentMemoryIndex, usIndex: UnalignedSentenceIndex): Prediction[] {
    for (const p of predictions) {
      let weight = 0;

      const x = usIndex.static.sourceNgramFrequency.read(p.source);
      const y = usIndex.static.targetNgramFrequency.read(p.target);
      const delta = Math.abs(x - y);
      weight = 1 / (delta + 1);
      p.setScore("alignmentOccurrences", weight);
    }
    return predictions;
  }

}
