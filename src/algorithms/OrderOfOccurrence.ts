import {Prediction} from "../core";
import {fitToRange} from "../util/math";
import {GlobalAlgorithm} from "./GlobalAlgorithm";

// this doesn't work
export class OrderOfOccurrence extends GlobalAlgorithm {
    public name: string = "order of occurrence";

    execute(predictions: Prediction[]): Prediction[] {
        // const occurrencePredictions: number[] = [];
        const occurrenceLocations: any = {};
        const occurrenceRanges: any = {};

        // find predictions that have multiple occurrences
        for (let i = 0, len = predictions.length; i < len; i++) {
            const p = predictions[i];
            if (p.target.occurrences > 1) {
                const key = p.target.toString();
                if (!occurrenceLocations[key]) {
                    occurrenceLocations[key] = [];
                    occurrenceRanges[key] = [1, 0];
                }
                const weight = p.getScore("alignmentPosition");
                // track range of weights
                if (weight > occurrenceRanges[key][1]) {
                    occurrenceRanges[key][1] = weight;
                }
                if (weight < occurrenceRanges[key][0]) {
                    occurrenceRanges[key][0] = weight;
                }
                occurrenceLocations[key].push(i);
            }
        }

        // score occurrences in descending order
        const keys = Object.keys(occurrenceLocations);
        for (let k = 0, len = keys.length; k < len; k++) {
            const locations = occurrenceLocations[keys[k]];
            const range = occurrenceRanges[keys[k]];
            for (let j = 0, jLen = locations.length; j < jLen; j++) {
                const p = predictions[locations[j]];
                // re-distribute the weights
                const weight = fitToRange(p.target.occurrence, 1, p.target.occurrences, range[0], range[1]);
                p.setScore("fixedAlignmentPosition", weight);
            }
        }

        return predictions;
    }
}
