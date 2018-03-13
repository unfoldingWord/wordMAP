import Algorithm from '../interfaces/Algorithm';

/**
 * This algorithm calculates the frequency of n-gram occurrences.
 */
export default class NgramFrequency implements Algorithm {
    name: string = 'n-gram frequency';

    execute(state:object): object {
        return state;
    }
}