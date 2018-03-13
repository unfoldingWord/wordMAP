import Ngram from './Ngram';

/**
 * Represents two individual n-grams that have been matched from two texts.
 * e.g. from a primary text and secondary text.
 */
export default class Alignment {

    private _sourceNgram: Ngram;
    private _targetNgram: Ngram;

    /**
     * @param {Ngram} sourceNgram - an n-gram from the source text
     * @param {Ngram} targetNgram - an n-gram from the secondary text
     */
    constructor(sourceNgram: Ngram, targetNgram: Ngram) {
        this._sourceNgram = sourceNgram;
        this._targetNgram = targetNgram;
    }

    /**
     * Returns the source n-gram
     * @return {Ngram}
     */
    public get sourceNgram() {
        return this._sourceNgram;
    }

    /**
     * Returns the target n-gram
     * @return {Ngram}
     */
    public get targetNgram() {
        return this._targetNgram;
    }
}
