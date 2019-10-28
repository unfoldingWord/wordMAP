import {Prediction} from "../core/";
import {AlignmentMemoryIndex, CorpusIndex, NumberObject} from "../index/";
import {GlobalAlgorithm} from "./";

/**
 * This algorithm calculates the frequency of n-gram occurrences.
 */
export class LemmaNgramFrequency extends GlobalAlgorithm {

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

  public name: string = "lemma n-gram frequency";

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
      // skip predictions without lemmas
      if (p.alignment.lemmaKey === undefined) {
        p.setScores({
          "sourceCorpusLemmaPermutationsFrequencyRatio": 0,
          "targetCorpusLemmaPermutationsFrequencyRatio": 0,
          "sourceAlignmentMemoryLemmaFrequencyRatio": 0,
          "targetAlignmentMemoryLemmaFrequencyRatio": 0
        });
        continue;
      }

      // alignment permutation frequency within the corpus/alignment memory
      const alignmentFrequencyCorpus: number = cIndex.permutations.alignmentFrequency.read(
        p.alignment.lemmaKey);
      const alignmentFrequencyAlignmentMemory: number = saIndex.alignmentFrequency.read(
        p.alignment.lemmaKey);

      // n-gram permutation frequency within the corpus/alignment memory
      // looked up by n-gram
      // TODO: rename to something like this.
      // const sourceNgramFrequencyInCorpusPermutations

      // first. default to default n-gram frequency
      let ngramFrequencyCorpusSource: number = cIndex.permutations.sourceNgramFrequency.read(
        p.source.key);
      let ngramFrequencyAlignmentMemorySource: number = saIndex.sourceNgramFrequency.read(
        p.source.key);
      let ngramFrequencyCorpusTarget: number = cIndex.permutations.targetNgramFrequency.read(
        p.target.key);
      let ngramFrequencyAlignmentMemoryTarget: number = saIndex.targetNgramFrequency.read(
        p.target.key);

      // second. use lemma n-gram frequency where available
      if (p.source.lemmaKey !== undefined) {
        ngramFrequencyCorpusSource = cIndex.permutations.sourceNgramFrequency.read(
          p.source.lemmaKey);
        ngramFrequencyAlignmentMemorySource = saIndex.sourceNgramFrequency.read(
          p.source.lemmaKey);
      }
      if (p.target.lemmaKey !== undefined) {
        ngramFrequencyCorpusTarget = cIndex.permutations.targetNgramFrequency.read(
          p.target.lemmaKey);
        ngramFrequencyAlignmentMemoryTarget = saIndex.targetNgramFrequency.read(
          p.target.lemmaKey);
      }

      // permutation frequency ratio
      const sourceCorpusLemmaPermutationsFrequencyRatio: number = LemmaNgramFrequency.divideSafe(
        alignmentFrequencyCorpus,
        ngramFrequencyCorpusSource
      );
      const targetCorpusLemmaPermutationsFrequencyRatio: number = LemmaNgramFrequency.divideSafe(
        alignmentFrequencyCorpus,
        ngramFrequencyCorpusTarget
      );
      const sourceAlignmentMemoryLemmaFrequencyRatio: number = LemmaNgramFrequency.divideSafe(
        alignmentFrequencyAlignmentMemory,
        ngramFrequencyAlignmentMemorySource
      );
      const targetAlignmentMemoryLemmaFrequencyRatio: number = LemmaNgramFrequency.divideSafe(
        alignmentFrequencyAlignmentMemory,
        ngramFrequencyAlignmentMemoryTarget
      );

      // store scores
      p.setScores({
        sourceCorpusLemmaPermutationsFrequencyRatio,
        targetCorpusLemmaPermutationsFrequencyRatio,
        sourceAlignmentMemoryLemmaFrequencyRatio,
        targetAlignmentMemoryLemmaFrequencyRatio
      });

      // sum alignment frequencies
      LemmaNgramFrequency.addObjectNumber(
        alignmentFrequencyCorpusSums,
        p.key,
        alignmentFrequencyCorpus
      );
      LemmaNgramFrequency.addObjectNumber(
        alignmentFrequencyAlignmentMemorySums,
        p.key,
        alignmentFrequencyAlignmentMemory
      );
    }

    // calculate filtered frequency ratios
    for (const p of predictions) {
      // skip predictions without lemmas
      if (p.alignment.lemmaKey === undefined) {
        p.setScores({
          // alignmentFrequencyCorpusFiltered,
          // alignmentFrequencyAlignmentMemoryFiltered,
          // TODO: we aren't using these at the moment
          "lemmaFrequencyRatioCorpusFiltered": 0,
          "lemmaFrequencyRatioAlignmentMemoryFiltered": 0
        });
        continue;
      }

      const alignmentFrequencyCorpus: number = cIndex.permutations.alignmentFrequency.read(
        p.alignment.lemmaKey);
      const alignmentFrequencyAlignmentMemory: number = saIndex.alignmentFrequency.read(
        p.alignment.lemmaKey);

      // TODO: instead of generating filters of alignmentFrequencyCorpus etc
      // we want to generate filtered ngramFrequencyCorpusSource and ngramFrequencyCorpusTarget
      // see notes in ngram_frequency line 160.

      // alignment frequency in the filtered corpus and alignment memory
      const alignmentFrequencyCorpusFiltered = alignmentFrequencyCorpusSums[p.key];
      const alignmentFrequencyAlignmentMemoryFiltered = alignmentFrequencyAlignmentMemorySums[p.key];

      // source and target frequency ratio for the corpus and alignment memory
      const lemmaFrequencyRatioCorpusFiltered: number = LemmaNgramFrequency.divideSafe(
        alignmentFrequencyCorpus,
        alignmentFrequencyCorpusFiltered
      );
      const lemmaFrequencyRatioAlignmentMemoryFiltered: number = LemmaNgramFrequency.divideSafe(
        alignmentFrequencyAlignmentMemory,
        alignmentFrequencyAlignmentMemoryFiltered
      );

      // store scores
      p.setScores({
        // alignmentFrequencyCorpusFiltered,
        // alignmentFrequencyAlignmentMemoryFiltered,
        // TODO: we aren't using these at the moment
        lemmaFrequencyRatioCorpusFiltered,
        lemmaFrequencyRatioAlignmentMemoryFiltered
      });
    }

    return predictions;
  }

}
