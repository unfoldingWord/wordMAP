import {AlgorithmType, GlobalAlgorithm} from "../algorithms";

export class Scheduler {
    readonly batches: AlgorithmType[][];
    private batchIndex: number;

    constructor() {
        this.batches = [];
        this.batchIndex = -1;
    }

    public add(entry: AlgorithmType): void {
        const last = this.lastItem();
        if (last && this.typeOf(entry) !== this.typeOf(last)) {
            // start new batch
            this.batchIndex++;
            this.batches.push([]);
        } else if (this.batchIndex === -1) {
            // initialize first batch
            this.batchIndex++;
            this.batches.push([]);
        }

        this.batches[this.batchIndex].push(entry);
    }

    /**
     * Returns the type of the entry
     * @param entry
     */
    private typeOf(entry: AlgorithmType): string {
        if (entry instanceof GlobalAlgorithm) {
            return "GlobalAlgorithm";
        } else {
            return "Algorithm";
        }
    }

    /**
     * Returns the last item added or null
     */
    private lastItem(): AlgorithmType | null {
        if (this.batchIndex >= 0) {
            const size = this.batches[this.batchIndex].length;
            if (size > 0) {
                return this.batches[this.batchIndex][size - 1];
            }
        }
        return null;
    }
}
