import {WordMap} from "../WordMap";

describe("predict", () => {
    it("uses as many words as possible", () => {
        const map = new WordMap();
        const source = "In a galaxy far far away";
        const target = "At some place distant very distant from here";
        map.appendAlignmentMemoryString("far", "distant");
        map.appendAlignmentMemoryString("far", "very distant");
        const suggestions = map.predict(source, target, 1);
        const predictions = suggestions[0].getPredictions()
            .filter((p) => p.confidence >= 1);
        expect(predictions.length).toEqual(2);
        expect(predictions[0].key).toEqual("n:far->n:distant");
        expect(predictions[1].key).toEqual("n:far->n:very:distant");
    });

    it("uses the memory that fits", () => {
        const map = new WordMap();
        const source = "In a galaxy far far away";
        const target = "At some place very distant distant from here";
        map.appendAlignmentMemoryString("far", "distant");
        map.appendAlignmentMemoryString("far", "very distant");
        const suggestions = map.predict(source, target, 1);
        const predictions = suggestions[0].getPredictions()
            .filter((p) => p.confidence >= 1);
        expect(predictions.length).toEqual(2);
        expect(predictions[0].key).toEqual("n:far->n:distant");
        expect(predictions[1].key).toEqual("n:far->n:distant");
    });

    it("prefers the predominate alignment memory when there are several alignment options", () => {
        const map = new WordMap();
        const source = "In a galaxy far far away";
        const target = "At some place very distant from here";
        map.appendAlignmentMemoryString("far", "distant");
        map.appendAlignmentMemoryString("far", "very distant");
        map.appendAlignmentMemoryString("far", "very distant");
        map.appendAlignmentMemoryString("far", "very distant");
        map.appendAlignmentMemoryString("far", "very distant");
        const suggestions = map.predict(source, target, 1);
        const predictions = suggestions[0].getPredictions()
            .filter((p) => p.confidence >= 1);
        expect(predictions.length).toEqual(1);
        expect(predictions[0].key).toEqual("n:far->n:very:distant");
    });

    it("prefers the predominate alignment memory when there is only one alignment option", () => {
        const map = new WordMap();
        const source = "In a galaxy far away";
        const target = "At some place very distant from here";
        map.appendAlignmentMemoryString("far", "distant");
        map.appendAlignmentMemoryString("far", "very distant");
        map.appendAlignmentMemoryString("far", "very distant");
        map.appendAlignmentMemoryString("far", "very distant");
        map.appendAlignmentMemoryString("far", "very distant");
        const suggestions = map.predict(source, target, 1);
        const predictions = suggestions[0].getPredictions()
            .filter((p) => p.confidence >= 1);
        expect(predictions.length).toEqual(1);
        expect(predictions[0].key).toEqual("n:far->n:very:distant");
    });
});
