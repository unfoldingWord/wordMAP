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
 * Expands a prediction into an array of items that can be validated.
 * Tokens with occurrences equal to 1 are ignored.
 * @param prediction
 */
export function getSequentialOccurrenceProps(prediction: Prediction): SequentialOccurrenceProps[] {
    const tokens = prediction.target.getTokens();
    const items: SequentialOccurrenceProps[] = [];
    for (let i = 0, len = tokens.length; i < len; i++) {
        if (tokens[i].occurrences > 1) {
            items.push({
                key: tokens[i].toString(),
                position: prediction.source.tokenPosition,
                occurrence: tokens[i].occurrence
            });
        }
    }
    return items;
}

/**
 * Utility to check if occurrences are used sequentially
 */
export function useSequentialOccurrence(): [(arg0: SequentialOccurrenceProps) => boolean, (arg0: SequentialOccurrenceProps) => void, () => void, () => boolean] {
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
     * Performs a final review of the occurrences to ensure the occurrences begin at 1
     * and there are no skipped occurrences.
     * I'm not sure we should use this because enforcing occurrences to begin at 1 and continue without gaps
     * could cause us to lose a lot of valid suggestions.
     */
    function review(): boolean {
        const keys = Object.keys(items);
        for (let i = 0, keyLen = keys.length; i < keyLen; i++) {
            const item = items[keys[i]];
            const numOccurrences = item.length;

            // TRICKY: we can be certain the occurrences are in order if they range are in the range of 1 to numOccurrences.
            let startsAtOne = false;
            for (let j = 0; j < numOccurrences; j++) {
                if (item[j].occurrence === 1) {
                    startsAtOne = true;
                }
                if (item[j].occurrence > numOccurrences) {
                    return false;
                }
            }
            if (!startsAtOne) {
                return false;
            }
        }
        return true;
    }

    /**
     * Resets the validation queue
     */
    function reset() {
        items = {};
    }

    return [ok, add, reset, review];
}
