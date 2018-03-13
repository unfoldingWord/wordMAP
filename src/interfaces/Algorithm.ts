export default interface Algorithm {
    /**
     * Executes the algorithm
     */
    execute(state:object):object;

    /**
     * The name of the algorithm
     */
    readonly name:string;
}