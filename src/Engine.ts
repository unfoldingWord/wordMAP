import NotImplemented from './errors/NotImplemented';
import Alignment from './Alignment';
import Ngram from './Ngram';
import Index from './Index';

/**
 * Represents a multi-lingual word alignment prediction engine.
 */
export default class Engine {

    private _primarySavedAlignmentFrequencyIndex:Index = {};
    private _secondarySavedAlignmentFrequencyIndex:Index = {};

    constructor() {
        // TODO: read in custom configuration
    }

    /**
     * Returns the saved alignments index keyed by n-grams in the primary text
     * @return {Index}
     */
    public get primarySavedAlignmentFrequencyIndex():Index {
        return this._primarySavedAlignmentFrequencyIndex;
    }

    /**
     * Returns the saved alignments index keyed by n-grams in the secondary text
     * @return {Index}
     */
    public get secondarySavedAlignmentFrequencyIndex():Index {
        return this._secondarySavedAlignmentFrequencyIndex;
    }

    appendCorpus() {
        throw new NotImplemented();
    }


    /**
     * Appends new saved allignments to the engine.
     * Adding saved alignments improves the quality of predictions.
     * @param {Array<Alignment>} savedAlignments - a list of alignments
     */
    appendSavedAlignment(savedAlignments: Array<Alignment>) {
        for(const alignment of savedAlignments) {
            const source = alignment.sourceNgram;
            const target = alignment.targetNgram;
            this._primarySavedAlignmentFrequencyIndex = Engine.indexAlignmentNgrams(this._primarySavedAlignmentFrequencyIndex, source, target);
            this._secondarySavedAlignmentFrequencyIndex = Engine.indexAlignmentNgrams(this._secondarySavedAlignmentFrequencyIndex, source, target);
        }
    }

    /**
     * Indexes an alignment's n-grams.
     * @param {Index} index - The initial index. This will not be modified directly.
     * @param {Ngram} primaryNgram -
     * @param {Ngram} secondaryNgram -
     * @return {Index} a copy of the index with the new data.
     */
    private static indexAlignmentNgrams(index:Index, primaryNgram:Ngram, secondaryNgram:Ngram) {
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
