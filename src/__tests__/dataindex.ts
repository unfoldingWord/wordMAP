import DataIndex from '../DataIndex';
import {alignSentence} from './testUtils';
describe('append saved alignments', () => {
    it('begins empty', () => {
        const engine = new DataIndex();
        expect(engine.primaryAlignmentFrequencyIndex).toEqual({});
        expect(engine.secondaryAlignmentFrequencyIndex).toEqual({});
    });

    it('counts occurrences', () => {
        const engine = new DataIndex();
        const firstSentence = alignSentence('Once upon a time, in a galaxy far far away...');
        engine.addAlignments(firstSentence);
        expect(engine.primaryAlignmentFrequencyIndex["far"]['raf']).toEqual(2);
        expect(engine.primaryAlignmentFrequencyIndex["a"]['a']).toEqual(2);
        expect(engine.primaryAlignmentFrequencyIndex["in"]['ni']).toEqual(1);

        const secondSentence = alignSentence('Once upon a time');
        engine.addAlignments(secondSentence);
        expect(engine.primaryAlignmentFrequencyIndex["far"]['raf']).toEqual(2);
        expect(engine.primaryAlignmentFrequencyIndex["a"]['a']).toEqual(3);
        expect(engine.primaryAlignmentFrequencyIndex["in"]['ni']).toEqual(1);
    });
});
