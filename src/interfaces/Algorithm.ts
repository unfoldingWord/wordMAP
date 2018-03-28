import KeyStore from "./KeyStore";
import DataIndex from "../DataIndex";
import Token from "../structures/Token";

export default interface Algorithm {
    /**
     * Executes the algorithm
     */
    execute(state:KeyStore, corpusIndex:DataIndex, savedAlignmentsIndex:DataIndex, unalignedSentencePair:[Array<Token>, Array<Token>]):KeyStore;

    /**
     * The name of the algorithm
     */
    readonly name:string;
}
