import Algorithm from "../Algorithm";
import Index from "../index/Index";
import Store from "../index/Store";
import Ngram from "../structures/Ngram";
import NumberObject from "../structures/NumberObject";
import Prediction from "../structures/Prediction";
import Token from "../structures/Token";

/**
 * This algorithm calculates the frequency of n-gram occurrences.
 */
export default class NgramFrequency implements Algorithm {

  /**
   * Counts how often an ngram appears in the index
   * @param {Index} index - the index to search
   * @param {Ngram} ngram - the ngram to count
   * @return {number}
   */
  private static countNgramFrequency(index: Index, ngram: Ngram): number {
    return index.readSum(ngram.toString());
  }

  /**
   * Reads the alignment frequency from an index
   * @param {Index} index
   * @param {Ngram} sourceNgram
   * @param {Ngram} targetNgram
   * @return {number}
   */
  private static readAlignmentFrequency(index: Index, sourceNgram: Ngram, targetNgram: Ngram): number {
    const alignmentFrequency = index.read(
      sourceNgram.toString(),
      targetNgram.toString()
    );
    if (alignmentFrequency === undefined) {
      return 0;
    } else {
      return alignmentFrequency;
    }
  }

  /**
   * Performs a numerical addition with the value of a key in a number object.
   * TODO: move this into it's own class??
   *
   * @param {NumberObject} object
   * @param {string} key
   * @param {number} value
   */
  private static addObjectNumber(object: NumberObject, key: string, value: number) {
    if (!(key in object)) {
      object[key] = 0;
    }
    object[key] += value;
  }

  public name: string = "n-gram frequency";

  public execute(predictions: Prediction[], corpusStore: Store, savedAlignmentsStore: Store, unalignedSentencePair: [Token[], Token[]]): Prediction[] {
    const alignmentFrequencyCorpusSums: NumberObject = {};
    const alignmentFrequencySavedAlignmentsSums: NumberObject = {};

    for (const p  of predictions) {
      // Alignment frequency in the corpus and saved alignments
      const alignmentFrequencyCorpus = NgramFrequency.readAlignmentFrequency(
        corpusStore.primaryAlignmentFrequencyIndex,
        p.alignment.source,
        p.alignment.target
      );
      const alignmentFrequencySavedAlignments = NgramFrequency.readAlignmentFrequency(
        savedAlignmentsStore.primaryAlignmentFrequencyIndex,
        p.alignment.source,
        p.alignment.target
      );

      // source and target n-gram frequency in the corpus and saved alignments
      const ngramFrequencyCorpusSource = NgramFrequency.countNgramFrequency(
        corpusStore.primaryAlignmentFrequencyIndex,
        p.alignment.source
      );
      const ngramFrequencySavedAlignmentsSource = NgramFrequency.countNgramFrequency(
        savedAlignmentsStore.primaryAlignmentFrequencyIndex,
        p.alignment.source
      );
      const ngramFrequencyCorpusTarget = NgramFrequency.countNgramFrequency(
        corpusStore.secondaryNgramFrequencyIndex,
        p.alignment.target
      );
      const ngramFrequencySavedAlignmentsTarget = NgramFrequency.countNgramFrequency(
        savedAlignmentsStore.secondaryNgramFrequencyIndex,
        p.alignment.target
      );

      // source and target frequency ratio for the corpus and saved alignments
      const frequencyRatioCorpusSource: number = alignmentFrequencyCorpus /
        ngramFrequencyCorpusSource;
      const frequencyRatioCorpusTarget: number = alignmentFrequencyCorpus /
        ngramFrequencyCorpusTarget;
      const frequencyRatioSavedAlignmentsSource: number = alignmentFrequencySavedAlignments /
        ngramFrequencySavedAlignmentsSource;
      const frequencyRatioSavedAlignmentsTarget: number = alignmentFrequencySavedAlignments /
        ngramFrequencySavedAlignmentsTarget;

      // store scores
      p.setScores({
        alignmentFrequencyCorpus,
        alignmentFrequencySavedAlignments,

        ngramFrequencyCorpusSource,
        ngramFrequencyCorpusTarget,
        ngramFrequencySavedAlignmentsSource,
        ngramFrequencySavedAlignmentsTarget,

        frequencyRatioCorpusSource,
        frequencyRatioCorpusTarget,
        frequencyRatioSavedAlignmentsSource,
        frequencyRatioSavedAlignmentsTarget
      });

      // sum alignment frequencies
      NgramFrequency.addObjectNumber(
        alignmentFrequencyCorpusSums,
        p.toString(),
        alignmentFrequencyCorpus
      );
      NgramFrequency.addObjectNumber(
        alignmentFrequencySavedAlignmentsSums,
        p.toString(),
        alignmentFrequencySavedAlignments
      );
    }

    // calculate filtered frequency ratios
    for (const p of predictions) {
      const {
        alignmentFrequencyCorpus,
        alignmentFrequencySavedAlignments
      } = p.getScores();

      // TODO: is this correct terminology?

      // alignment frequency in the filtered corpus and saved alignments
      const alignmentFrequencyCorpusFiltered = alignmentFrequencyCorpusSums[p.toString()];
      const alignmentFrequencySavedAlignmentsFiltered = alignmentFrequencySavedAlignmentsSums[p.toString()];

      // source and target frequency ratio for the corpus and saved alignments
      const frequencyRatioCorpusSourceFiltered: number = alignmentFrequencyCorpus /
        alignmentFrequencyCorpusFiltered;
      const frequencyRatioSavedAlignmentsFiltered: number = alignmentFrequencySavedAlignments /
        alignmentFrequencySavedAlignmentsFiltered;

      // store scores
      p.setScores({
        alignmentFrequencyCorpusFiltered,
        alignmentFrequencySavedAlignmentsFiltered,

        frequencyRatioCorpusSourceFiltered,
        frequencyRatioSavedAlignmentsFiltered
      });
    }

    return predictions;
  }

}
