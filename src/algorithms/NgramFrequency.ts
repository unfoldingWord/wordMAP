import Algorithm from '../interfaces/Algorithm';
import KeyStore from "../interfaces/KeyStore";
import DataIndex from "../DataIndex";
import Token from "../structures/Token";
import Engine from "../Engine";
import Ngram from "../structures/Ngram";
import Alignment from "../structures/Alignment";

/**
 * This algorithm calculates the frequency of n-gram occurrences.
 */
export default class NgramFrequency implements Algorithm {
    name: string = 'n-gram frequency';

    execute(state: KeyStore, corpusIndex: DataIndex, savedAlignmentsIndex: DataIndex, unalignedSentencePair: [Array<Token>, Array<Token>]): KeyStore {
        const primarySentenceNgrams = Engine.generateSentenceNgrams(unalignedSentencePair[0]);
        const secondarySentenceNgrams = Engine.generateSentenceNgrams(unalignedSentencePair[1]);
        const alignments = Engine.generateAlignmentPermutations(primarySentenceNgrams, secondarySentenceNgrams);

        const filteredCorpusIndex = NgramFrequency.filterIndex(corpusIndex, alignments);
        const filteredSavedAlignmentsIndex = NgramFrequency.filterIndex(savedAlignmentsIndex, alignments);

        const alignmentStuff = NgramFrequency.calculateFrequency(primarySentenceNgrams, secondarySentenceNgrams, savedAlignmentsIndex);
        const filteredAlignmenStuff = NgramFrequency.calculateFrequency(primarySentenceNgrams, secondarySentenceNgrams, filteredSavedAlignmentsIndex);
        const corpusStuff = NgramFrequency.calculateFrequency(primarySentenceNgrams, secondarySentenceNgrams, corpusIndex);
        const filteredCorpusStuff = NgramFrequency.calculateFrequency(primarySentenceNgrams, secondarySentenceNgrams, filteredCorpusIndex);

        // TODO: return the formatted state
        return {};
    }

    /**
     * Filters an index to just the data relative to the control set
     * @param {DataIndex} index - the index to be filtered.
     * @param {Array<Alignment>} controlSet - an array of alignments that will control what is filtered.
     * @return {DataIndex} a new filtered index
     */
    private static filterIndex(index:DataIndex, controlSet:Array<Alignment>) {
        // TODO: filter the index
        return index;
    }

    /**
     * Calculates the n-gram frequency
     * @param {Array<Ngram>} primaryNgrams - an array of n-grams for the primary sentence
     * @param {Array<Ngram>} secondaryNgrams - an array of n-grams from the secondary sentence
     * @param {DataIndex} index - the index over which the calculations will be performed
     * @return {KeyStore[]}
     */
    private static calculateFrequency(primaryNgrams:Array<Ngram>, secondaryNgrams:Array<Ngram>, index:DataIndex) {
        const primaryIndex:KeyStore = {};
        const secondaryIndex:KeyStore = {};

        for(const pNgram of primaryNgrams) {
            for(const sNgram of secondaryNgrams) {
                const alignmentFrequency = index.getPrimaryAlignmentFrequency(pNgram, sNgram);
                primaryIndex[pNgram.toString()][sNgram.toString()] = {
                    alignmentFrequency,
                    primaryCorpusFrequency: 0, // TODO: calculate
                    primaryCorpusFrequencyRatio: 0 // TODO: calculate
                };
            }
        }

        return [primaryIndex, secondaryIndex];
    }
}
