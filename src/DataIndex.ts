import KeyStore from "./interfaces/KeyStore";
import Ngram from "./structures/Ngram";
import Token from "./structures/Token";
import NotImplemented from "./errors/NotImplemented";
import Alignment from "./structures/Alignment";

/**
 * Represents an index of linguistic data
 */
export default class DataIndex {
    private _primaryAlignmentFrequencyIndex:KeyStore = {};
    private _secondaryAlignmentFrequencyIndex:KeyStore = {};

    /**
     * Returns the saved alignments index keyed by n-grams in the primary text
     * @return {KeyStore}
     */
    public get primaryAlignmentFrequencyIndex():KeyStore {
        return this._primaryAlignmentFrequencyIndex;
    }

    /**
     * Returns the saved alignments index keyed by n-grams in the secondary text
     * @return {KeyStore}
     */
    public get secondaryAlignmentFrequencyIndex():KeyStore {
        return this._secondaryAlignmentFrequencyIndex;
    }

    /**
     * Returns the n-gram frequency index for n-grams in the primary text
     * @return {KeyStore}
     */
    public get primaryNgramFrequencyIndex():KeyStore {
        return {};
    }

    /**
     * Returns the n-gram frequency index for n-grams in the secondary text
     * @return {KeyStore}
     */
    public get secondaryNgramFrequencyIndex():KeyStore {
        return {};
    }

    /**
     * Returns the alignment frequency found in the primary index
     * @param {Ngram} primaryNgram
     * @param {Ngram} secondaryNgram
     * @return {number}
     */
    public getPrimaryAlignmentFrequency(primaryNgram:Ngram, secondaryNgram:Ngram) {
        return DataIndex.getAlignmentFrequency(this._primaryAlignmentFrequencyIndex, primaryNgram, secondaryNgram);
    }

    /**
     * Returns the alignment frequency found in the secondary index
     *
     * @param {Ngram} primaryNgram
     * @param {Ngram} secondaryNgram
     * @return {number}
     */
    public getSecondaryAlignmentFrequency(primaryNgram:Ngram, secondaryNgram:Ngram) {
        return DataIndex.getAlignmentFrequency(this._secondaryAlignmentFrequencyIndex, secondaryNgram, primaryNgram);
    }

    /**
     * Returns the alignment frequency found in the index.
     * @param {KeyStore} index - the index of alignment frequencies
     * @param {Ngram} primaryNgram - the primary text n-gram
     * @param {Ngram} secondaryNgram - the secondary text n-gram
     * @return {number}
     */
    private static getAlignmentFrequency(index:KeyStore, primaryNgram:Ngram, secondaryNgram:Ngram) {
        const primaryKey = primaryNgram.toString();
        const secondaryKey = secondaryNgram.toString();
        if(primaryKey in index && secondaryKey in index[primaryKey]) {
            return index[primaryKey][secondaryKey];
        } else {
            return 0;
        }
    }

    /**
     * This will be used to append sentence pairs to the index.
     * @param {[Array<Token>]} sentencePair
     */
    public addSentencePair(sentencePair:[Array<Token>, Array<Token>]) {
        throw new NotImplemented();
    }

    public addAlignments(alignments: Array<Alignment>) {
        for(const alignment of alignments) {
            const source = alignment.sourceNgram;
            const target = alignment.targetNgram;

            // index the alignment frequency
            this._primaryAlignmentFrequencyIndex = DataIndex.indexAlignmentNgrams(this._primaryAlignmentFrequencyIndex, source, target);
            this._secondaryAlignmentFrequencyIndex = DataIndex.indexAlignmentNgrams(this._secondaryAlignmentFrequencyIndex, target, source);

            // TODO: index the n-gram frequency
        }
    }

    /**
     * This increments the indexed frequency count for n-grams in the alignment.
     * This method is agnostic to the primary and secondary alignment indices therefore it
     * accepts the n-grams directly rather than the alignment object itself.
     *
     * @param {KeyStore} index - The initial index. This will not be modified directly.
     * @param {Ngram} primaryNgram - the alignments's primary n-gram
     * @param {Ngram} secondaryNgram - the alignment's secondary n-gram
     * @return {KeyStore} a copy of the index with the new data.
     */
    private static indexAlignmentNgrams(index:KeyStore, primaryNgram:Ngram, secondaryNgram:Ngram) {
        const updatedIndex = Object.assign({}, index);
        const primaryKey:string = primaryNgram.toString();
        const secondaryKey:string = secondaryNgram.toString();

        if(!(primaryKey in updatedIndex)) {
            updatedIndex[primaryKey] = {};
        }
        if(!(secondaryKey in updatedIndex[primaryKey])) {
            updatedIndex[primaryKey][secondaryKey] = 0;
        }
        updatedIndex[primaryKey][secondaryKey] += 1;
        return updatedIndex;
    }
}
