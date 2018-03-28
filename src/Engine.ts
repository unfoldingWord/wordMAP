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
     * Returns a list of algorithms that are registered in the engine
     * @return {Array<Algorithm>}
     */
    get algorithms() {
        return this._algorithms;
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
     * Runs th engine
     *
     * @param {[Array<Token>]} unalignedSentencePair - The unaligned sentence pair for which alignments will be predicted.
     */
    public run(unalignedSentencePair:[Array<Token>, Array<Token>]) {
        let state:KeyStore = {};
        for(const algorithm of this._algorithms) {
            console.log(`executing ${algorithm.name} algorithm`);
            state = algorithm.execute(state, this.corpusIndex, this.savedAlignmentsIndex, unalignedSentencePair);
        }
    }
}
