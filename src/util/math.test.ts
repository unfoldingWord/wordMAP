import {fitToRange, scaleUp} from "./math";

describe("fitToRange from 1-5 to 0-1", () => {
    it("fits 1 to 0", () => {
        const result = fitToRange(1, 1, 5, 0, 1);
        expect(result).toEqual(0);
    });

    it("fits 5 to 1", () => {
        const result = fitToRange(5, 1, 5, 0, 1);
        expect(result).toEqual(1);
    });

    it("fits 3 to 0.5", () => {
        const result = fitToRange(3, 1, 5, 0, 1);
        expect(result).toEqual(0.5);
    });
});

describe("fitToRange from 0-1 to 0.9-1", () => {
    it("fits 1 to 1", () => {
        const result = fitToRange(1, 0, 1, 0.9, 1);
        expect(result).toEqual(1);
    });

    it("fits 0 to 0.9", () => {
        const result = fitToRange(0, 0, 1, 0.9, 1);
        expect(result).toEqual(0.9);
    });

    it("fits 0.5 to 0.95", () => {
        const result = fitToRange(0.5, 0, 1, 0.9, 1);
        expect(result).toEqual(0.95);
    });
});

describe("scaleUp", () => {
    it("should scale 0.5 up to 1", () => {
        expect(scaleUp(0.5, 1)).toEqual(1);
    });

    it("should scale 0.5 to 0.5", () => {
        expect(scaleUp(0.5, 0)).toEqual(0.5);
    });

    it("should scale 0.5 to 0.75", () => {
        expect(scaleUp(0.5, 0.5)).toEqual(0.75);
    });
});
