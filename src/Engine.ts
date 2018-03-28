import NotImplemented from './errors/NotImplemented';
import Alignment from './structures/Alignment';
import Ngram from './structures/Ngram';
import KeyStore from './interfaces/KeyStore';
import Algorithm from './interfaces/Algorithm';
import Token from "./structures/Token";
import DataIndex from "./DataIndex";

/**
 * Represents a multi-lingual word alignment prediction engine.
 */
export default class Engine {

    private _algorithms:Array<Algorithm> = [];
    private corpusIndex:DataIndex;
    private savedAlignmentsIndex:DataIndex;

    constructor() {
        // TODO: read in custom configuration
        this.corpusIndex = new DataIndex();
        this.savedAlignmentsIndex = new DataIndex();
    }

    /**
     * Adds a new algorithm to the engine.
     * @param {Algorithm} algorithm - the algorithm to run with the engine.
     */
    public registerAlgorithm(algorithm:Algorithm):void {
        this._algorithms.push(algorithm);
    }

    public addCorpus() {
        throw new NotImplemented();
    }


    /**
     * Appends new saved alignments to the engine.
     * Adding saved alignments improves the quality of predictions.
     * @param {Array<Alignment>} savedAlignments - a list of alignments
     */
    public addAlignments(savedAlignments: Array<Alignment>) {
        this.savedAlignmentsIndex.addAlignments(savedAlignments);
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
        let state:KeyStore = {};
        for(const algorithm of this._algorithms) {
            console.log(`executing ${algorithm.name} algorithm`);
            state = algorithm.execute(this.corpusIndex, this.savedAlignmentsIndex, unalignedSentencePair, state);
        }
    }
}
