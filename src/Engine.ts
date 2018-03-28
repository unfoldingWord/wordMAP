import NotImplemented from './errors/NotImplemented';
import Alignment from './structures/Alignment';
import Ngram from './structures/Ngram';
import Index from './interfaces/Index';
import Algorithm from './interfaces/Algorithm';
import Token from "./structures/Token";

/**
 * Represents a multi-lingual word alignment prediction engine.
 */
export default class Engine {

    private _algorithms:Array<Algorithm> = [];
    private _primarySavedAlignmentFrequencyIndex:Index = {};
    private _secondarySavedAlignmentFrequencyIndex:Index = {};

    constructor() {
        // TODO: read in custom configuration

    }

    /**
     * Adds a new algorithm to the engine.
     * @param {Algorithm} algorithm - the algorithm to run with the engine.
     */
    public registerAlgorithm(algorithm:Algorithm):void {
        this._algorithms.push(algorithm);
    }

    /**
     * Returns the saved alignments index keyed by n-grams in the primary text
     * @return {Index}
     */
    public get primaryAlignmentIndex():Index {
        return this._primarySavedAlignmentFrequencyIndex;
    }

    /**
     * Returns the saved alignments index keyed by n-grams in the secondary text
     * @return {Index}
     */
    public get secondaryAlignmentIndex():Index {
        return this._secondarySavedAlignmentFrequencyIndex;
    }

    addCorpus() {
        throw new NotImplemented();
    }


    /**
     * Appends new saved alignments to the engine.
     * Adding saved alignments improves the quality of predictions.
     * @param {Array<Alignment>} savedAlignments - a list of alignments
     */
    addAlignments(savedAlignments: Array<Alignment>) {
        for(const alignment of savedAlignments) {
            const source = alignment.sourceNgram;
            const target = alignment.targetNgram;
            this._primarySavedAlignmentFrequencyIndex = Engine.indexAlignmentNgrams(this.primaryAlignmentIndex, source, target);
            this._secondarySavedAlignmentFrequencyIndex = Engine.indexAlignmentNgrams(this.secondaryAlignmentIndex, target, source);
        }
    }

    /**
     * This increments the indexed frequency count for n-grams in the alignment.
     * This method is agnostic to the primary and secondary alignment indices therefore it
     * accepts the n-grams directly rather than the alignment object itself.
     *
     * @param {Index} index - The initial index. This will not be modified directly.
     * @param {Ngram} primaryNgram - the alignments's primary n-gram
     * @param {Ngram} secondaryNgram - the alignment's secondary n-gram
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

    /**
     * Generates an array of all possible contiguous n-grams within the sentence.
     * @param {Array<Token>} sentence
     * @param {number} maxNgramLength
     * @returns {any[]}
     */
    public static generateSentenceNgrams(sentence:Array<Token>, maxNgramLength:number=3) {
        if(maxNgramLength < 0) throw new RangeError(`Maximum n-gram size cannot be less than 0. Received ${maxNgramLength}`);
        let ngrams:Array<Ngram> = [];
        const maxLength = Math.min(maxNgramLength, sentence.length);
        for(let ngramLength=1; ngramLength < maxLength; ngramLength ++) {
            ngrams = ngrams.concat(Engine.readSizedNgrams(sentence, ngramLength));
        }
        return ngrams;
    }

    /**
     * Returns an array of n-grams of a particular size from a sentence
     * @param {Array<Token>} sentence - the sentence from which n-grams will be read
     * @param {number} ngramLength - the length of each n-gram.
     * @returns {Array<Ngram>}
     */
    public static readSizedNgrams(sentence:Array<Token>, ngramLength:number):Array<Ngram> {
        const ngrams:Array<Ngram> = [];
        for(let index=0; index < sentence.length; index ++) {
            const end = index + ngramLength;
            if(end >= sentence.length) break;
            const ngram = new Ngram(sentence.slice(index, end));
            ngrams.push(ngram);
        }
        return ngrams;
    }

    /**
     * Generates an array of all possible alignments between two texts.
     * @param {Array<Ngram>} primaryNgrams - n-grams from the primary text
     * @param {Array<Ngram>} secondaryNgrams - n-grams from the secondary text
     * @returns {Array<Alignment>}
     */
    public static generateAlignmentPermutations(primaryNgrams:Array<Ngram>, secondaryNgrams:Array<Ngram>):Array<Alignment> {
        const alignments:Array<Alignment> = [];
        for(const pgram of primaryNgrams) {
            for(const sgram of secondaryNgrams) {
                alignments.push(new Alignment(pgram, sgram));
            }

            // TRICKY: include empty match alignment
            alignments.push(new Alignment(pgram, new Ngram()));
        }
        return alignments;
    }


    /**
     * Runs th engine
     *
     * @param {[Array<Token>]} unalignedSentencePair - The unaligned sentence pair for which alignments will be predicted.
     */
    public run(unalignedSentencePair:[Array<Token>, Array<Token>]) {
        const primarySentenceNgrams = Engine.generateSentenceNgrams(unalignedSentencePair[0]);
        const secondarySentenceNgrams = Engine.generateSentenceNgrams(unalignedSentencePair[1]);
        const alignments = Engine.generateAlignmentPermutations(primarySentenceNgrams, secondarySentenceNgrams);

        // filter corpus/saved alignment indices to just those within the sentences.
        // perform calculations on filtered and unfiltered indices.

        let state = {};
        for(const algorithm of this._algorithms) {
            console.log(`executing ${algorithm.name} algorithm`);
            state = algorithm.execute(state);
        }
    }
}
