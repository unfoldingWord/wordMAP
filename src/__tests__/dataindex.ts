import DataIndex from '../DataIndex';
import {alignSentence} from './testUtils';
describe('append saved alignments', () => {
    it('begins empty', () => {
        const index = new DataIndex();
        expect(index.primaryAlignmentFrequencyIndex).toEqual({});
        expect(index.secondaryAlignmentFrequencyIndex).toEqual({});
    });

    it('counts occurrences', () => {
        const index = new DataIndex();
        const firstSentence = alignSentence('Once upon a time, in a galaxy far far away...');
        index.addAlignments(firstSentence);
        expect(index.primaryAlignmentFrequencyIndex["far"]['raf']).toEqual(2);
        expect(index.primaryAlignmentFrequencyIndex["a"]['a']).toEqual(2);
        expect(index.primaryAlignmentFrequencyIndex["in"]['ni']).toEqual(1);

        const secondSentence = alignSentence('Once upon a time');
        index.addAlignments(secondSentence);
        expect(index.primaryAlignmentFrequencyIndex["far"]['raf']).toEqual(2);
        expect(index.primaryAlignmentFrequencyIndex["a"]['a']).toEqual(3);
        expect(index.primaryAlignmentFrequencyIndex["in"]['ni']).toEqual(1);
    });
});
