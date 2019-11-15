import {useSequentialOccurrence} from "./sequentialOccurrence";

describe("useSequentialOccurrence", () => {
    it("is ok when empty", () => {
        const [ok] = useSequentialOccurrence();
        expect(ok({key: "word", position: 1, occurrence: 1})).toEqual(true);
    });

    it("is ok when adding next occurrence", () => {
        const [ok, add] = useSequentialOccurrence();
        const word = {key: "word", position: 1, occurrence: 1};
        add(word);
        expect(ok({...word, position: 2, occurrence: 2})).toEqual(true);
    });

    it("is ok when adding previous occurrence in earlier position", () => {
        const [ok, add] = useSequentialOccurrence();
        const word = {key: "word", position: 2, occurrence: 2};
        add(word);
        expect(ok({...word, position: 1, occurrence: 1})).toEqual(true);
    });

    it("fails when adding an earlier occurrence in a later position", () => {
        const [ok, add] = useSequentialOccurrence();
        const word = {key: "word", position: 1, occurrence: 2};
        add(word);
        expect(ok({...word, position: 2, occurrence: 1})).toEqual(false);
    });

    it("fails when adding a later occurrence in an earlier position", () => {
        const [ok, add] = useSequentialOccurrence();
        const word = {key: "word", position: 2, occurrence: 1};
        add(word);
        expect(ok({...word, position: 1, occurrence: 2})).toEqual(false);
    });

    it("fails when adding adding a duplicate", () => {
        const [ok, add] = useSequentialOccurrence();
        const word = {key: "word", position: 2, occurrence: 1};
        add(word);
        expect(ok(word)).toEqual(false);
    });

    describe("review", () => {
        it("should allow occurrences that range from 1-n", () => {
            const [ok, add, reset, review] = useSequentialOccurrence();
            add({key: "word", position: 1, occurrence: 1});
            add({key: "word", position: 2, occurrence: 2});
            add({key: "word", position: 3, occurrence: 3});
            expect(review()).toEqual(true);
        });

        it("should not allow occurrences that do not start at 1", () => {
            const [ok, add, reset, review] = useSequentialOccurrence();
            add({key: "word", position: 1, occurrence: 2});
            add({key: "word", position: 2, occurrence: 3});
            add({key: "word", position: 3, occurrence: 4});
            expect(review()).toEqual(false);
        });

        it("should not allow occurrences that are missing values", () => {
            const [ok, add, reset, review] = useSequentialOccurrence();
            add({key: "word", position: 1, occurrence: 1});
            add({key: "word", position: 2, occurrence: 3});
            add({key: "word", position: 3, occurrence: 4});
            expect(review()).toEqual(false);
        });
    });
});
