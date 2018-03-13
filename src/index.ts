import Engine from './Engine';
import NgramFrequency from './algorithms/NgramFrequency';
import Token from "./structures/Token";

export class MAP {
    private _engine:Engine;

    constructor() {
        this._engine = new Engine();
        this._engine.registerAlgorithm(new NgramFrequency());
    }

    public predict(unalignedSentencePair:[Array<Token>, Array<Token>]):void {
        this._engine.run(unalignedSentencePair);
    }
}