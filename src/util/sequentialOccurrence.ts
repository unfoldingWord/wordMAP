import {Prediction} from "../core";

export interface SequentialOccurrenceProps {
    /**
     * The word key
     */
    key: string;
    /**
     * The position where this word is being used
     */
    position: number;
    /**
     * The occurrence of this word instance
     */
    occurrence: number;
}

/**
 * Converts a prediction into props for use in {@link useSequentialOccurrence}.
 * @param prediction
 */
export function makeSequentialOccurrenceProps(prediction: Prediction): SequentialOccurrenceProps {
    return {
        key: prediction.target.key,
        position: prediction.source.tokenPosition,
        occurrence: prediction.target.occurrence
    };
}

/**
 * Utility to check if occurrences are used sequentially
 */
export function useSequentialOccurrence(): [(arg0: SequentialOccurrenceProps) => boolean, (arg0: SequentialOccurrenceProps) => void, () => void] {
    let items: any = {};

    /**
     * Checks if the occurrence is valid
     * @param key
     * @param position
     * @param occurrence
     */
    function ok({key, position, occurrence}: SequentialOccurrenceProps): boolean {
        if (items[key]) {
            for (let i = 0, len = items[key].length; i < len; i++) {
                const item = items[key][i];
                if (item.position >= position
                    && item.occurrence <= occurrence
                    || (item.position <= position
                        && item.occurrence >= occurrence)) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Adds a new occurrence
     * @param key
     * @param position
     * @param occurrence
     */
    function add({key, position, occurrence}: SequentialOccurrenceProps) {
        if (!items[key]) {
            items[key] = [];
        }
        items[key].push({
            position,
            occurrence
        });
    }

    /**
     * Resets the validation queue
     */
    function reset() {
        items = {};
    }

    return [ok, add, reset];
}
