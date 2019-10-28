import {Prediction} from "../core/Prediction";
import {AlignmentMemoryIndex} from "../index/AlignmentMemoryIndex";
import {CorpusIndex} from "../index/CorpusIndex";
import {NumberObject} from "../index/NumberObject";
import {GlobalAlgorithm} from "./GlobalAlgorithm";

/**
 * This algorithm calculates the frequency of n-gram occurrences.
 */
export class NgramFrequency extends GlobalAlgorithm {

  /**
   * Performs a numerical addition with the value of a key in a number object.
   * TODO: move this into it's own class?
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

  /**
   * Performs a numerical division.
   * Division by zero will result in 0.
   * TODO: move this into a math utility?
   *
   * @param {number} dividend
   * @param {number} divisor
   * @return {number}
   */
  private static divideSafe(dividend: number, divisor: number): number {
    if (divisor === 0) {
      return 0;
    } else {
      return dividend / divisor;
    }
  }

  public name: string = "n-gram frequency";

  /**
   * Load data into the predictions
   * @param  predictions [description]
   * @param  cIndex      [description]
   * @param  saIndex     [description]
   * @return             [description]
   */
  public execute(predictions: Prediction[], cIndex: CorpusIndex, saIndex: AlignmentMemoryIndex): Prediction[] {
    const alignmentFrequencyCorpusSums: NumberObject = {};
    const alignmentFrequencyAlignmentMemorySums: NumberObject = {};

    for (const p of predictions) {
      // alignment permutation frequency within the corpus/alignment memory
      const alignmentFrequencyCorpus: number = cIndex.permutations.alignmentFrequency.read(
        p.alignment);
      const alignmentFrequencyAlignmentMemory: number = saIndex.alignmentFrequency.read(
        p.alignment);

      // n-gram permutation frequency within the corpus/alignment memory
      // looked up by n-gram
      // TODO: rename to something like this.
      // const sourceNgramFrequencyInCorpusPermutations
      const ngramFrequencyCorpusSource: number = cIndex.permutations.sourceNgramFrequency.read(
        p.source);
      const ngramFrequencyAlignmentMemorySource: number = saIndex.sourceNgramFrequency.read(
        p.source);
      const ngramFrequencyCorpusTarget: number = cIndex.permutations.targetNgramFrequency.read(
        p.target);
      const ngramFrequencyAlignmentMemoryTarget: number = saIndex.targetNgramFrequency.read(
        p.target);

      // permutation frequency ratio
      const sourceCorpusPermutationsFrequencyRatio: number = NgramFrequency.divideSafe(
        alignmentFrequencyCorpus,
        ngramFrequencyCorpusSource
      );
      const targetCorpusPermutationsFrequencyRatio: number = NgramFrequency.divideSafe(
        alignmentFrequencyCorpus,
        ngramFrequencyCorpusTarget
      );
      const sourceAlignmentMemoryFrequencyRatio: number = NgramFrequency.divideSafe(
        alignmentFrequencyAlignmentMemory,
        ngramFrequencyAlignmentMemorySource
      );
      const targetAlignmentMemoryFrequencyRatio: number = NgramFrequency.divideSafe(
        alignmentFrequencyAlignmentMemory,
        ngramFrequencyAlignmentMemoryTarget
      );

      // store scores
      p.setScores({
        sourceCorpusPermutationsFrequencyRatio,
        targetCorpusPermutationsFrequencyRatio,
        sourceAlignmentMemoryFrequencyRatio,
        targetAlignmentMemoryFrequencyRatio
      });

      // sum alignment frequencies
      NgramFrequency.addObjectNumber(
        alignmentFrequencyCorpusSums,
        p.key,
        alignmentFrequencyCorpus
      );
      NgramFrequency.addObjectNumber(
        alignmentFrequencyAlignmentMemorySums,
        p.key,
        alignmentFrequencyAlignmentMemory
      );
    }

    // calculate filtered frequency ratios
    for (const p of predictions) {
      const alignmentFrequencyCorpus: number = cIndex.permutations.alignmentFrequency.read(
        p.alignment);
      const alignmentFrequencyAlignmentMemory: number = saIndex.alignmentFrequency.read(
        p.alignment);

      // TODO: instead of generating filters of alignmentFrequencyCorpus etc
      // we want to generate filtered ngramFrequencyCorpusSource and ngramFrequencyCorpusTarget
      // see notes in ngram_frequency line 160.

      // alignment frequency in the filtered corpus and alignment memory
      const alignmentFrequencyCorpusFiltered = alignmentFrequencyCorpusSums[p.key];
      const alignmentFrequencyAlignmentMemoryFiltered = alignmentFrequencyAlignmentMemorySums[p.key];

      // source and target frequency ratio for the corpus and alignment memory
      const frequencyRatioCorpusFiltered: number = NgramFrequency.divideSafe(
        alignmentFrequencyCorpus,
        alignmentFrequencyCorpusFiltered
      );
      const frequencyRatioAlignmentMemoryFiltered: number = NgramFrequency.divideSafe(
        alignmentFrequencyAlignmentMemory,
        alignmentFrequencyAlignmentMemoryFiltered
      );

      // store scores
      p.setScores({
        // alignmentFrequencyCorpusFiltered,
        // alignmentFrequencyAlignmentMemoryFiltered,

        // TODO: we aren't using these at the moment
        frequencyRatioCorpusFiltered,
        frequencyRatioAlignmentMemoryFiltered
      });
    }

    return predictions;
  }

}
