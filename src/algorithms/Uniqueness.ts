import {Prediction} from "../core/Prediction";
import {CorpusIndex} from "../index/CorpusIndex";
import {Algorithm} from "./Algorithm";

/**
 * Determines how unique the n-gram is.
 */
export class Uniqueness extends Algorithm {

    /**
     * Performs the uniqueness calculation.
     * This is the pure algorithm code.
     * @param sourceNgramFrequency - source n-gram frequency in the static corpus
     * @param targetNgramFrequency - target n-gram frequency in the static corpus
     * @param sourceTokenLength - length of the source text in units of {@link Token}
     * @param targetTokenLength - length of the target text in units of {@link Token}
     * @param phrasePlausibility - the likely hood that the n-gram is a phrase. Produced by {@link PhrasePlausibility}
     */
    public static calc(sourceNgramFrequency: number, targetNgramFrequency: number, sourceTokenLength: number, targetTokenLength: number, phrasePlausibility: number) {
        let weight = 0;

        if (sourceTokenLength !== 0 && targetTokenLength !== 0 && sourceNgramFrequency !== 0 && targetNgramFrequency !== 0) {
            // lower is better
            const sourceUniqueness = sourceNgramFrequency / sourceTokenLength;
            const targetUniqueness = targetNgramFrequency / targetTokenLength;
            // higher is better
            weight = Math.min(sourceUniqueness, targetUniqueness) /
                Math.max(sourceUniqueness, targetUniqueness);
            // TODO: if similarity is high and uniqueness is low we want to give a low score.
        }

        return weight * phrasePlausibility;
    }

    /**
     * Calculates the uniqueness of the n-gram
     * @param p
     * @param cIndex
     */
    private static calcUniqueness(p: Prediction, cIndex: CorpusIndex) {
        const sourceNgramStaticCorpusFrequency = cIndex.static.sourceNgramFrequency.read(
            p.source);
        const targetNgramStaticCorpusFrequency = cIndex.static.targetNgramFrequency.read(
            p.target);
        const weight = Uniqueness.calc(
            sourceNgramStaticCorpusFrequency,
            targetNgramStaticCorpusFrequency,
            cIndex.static.sourceTokenLength,
            cIndex.static.targetTokenLength,
            p.getScore("phrasePlausibility")
        );
        p.setScore("uniqueness", weight);
    }

    /**
     * Calculates the uniqueness of the n-gram based on the lemma
     * @param p
     * @param cIndex
     */
    private static calcLemmaUniqueness(p: Prediction, cIndex: CorpusIndex) {
        if (p.source.lemmaKey !== undefined && p.target.lemmaKey !== undefined) {
            const sourceNgramStaticCorpusLemmaFrequency = cIndex.static.sourceNgramFrequency.read(
                p.source.lemmaKey);
            const targetNgramStaticCorpusLemmaFrequency = cIndex.static.targetNgramFrequency.read(
                p.target.lemmaKey);
            const lemmaWeight = Uniqueness.calc(
                sourceNgramStaticCorpusLemmaFrequency,
                targetNgramStaticCorpusLemmaFrequency,
                cIndex.static.sourceTokenLength,
                cIndex.static.targetTokenLength,
                p.getScore("lemmaPhrasePlausibility")
            );
            p.setScore("lemmaUniqueness", lemmaWeight);
        } else {
            p.setScore("lemmaUniqueness", 0);
        }
    }

    public name = "uniqueness";

    public execute(prediction: Prediction, cIndex: CorpusIndex): Prediction {
        Uniqueness.calcUniqueness(prediction, cIndex);
        Uniqueness.calcLemmaUniqueness(prediction, cIndex);
        return prediction;
    }
}
