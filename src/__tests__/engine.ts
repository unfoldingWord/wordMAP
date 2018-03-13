import Engine from '../Engine';
import NotImplemented from '../errors/NotImplemented';
import {alignSentence} from './testUtils';

describe('append saved alignments', () => {
    it('begins empty', () => {
        const engine = new Engine();
        expect(engine.primarySavedAlignmentFrequencyIndex).toEqual({});
        expect(engine.secondarySavedAlignmentFrequencyIndex).toEqual({});
    });

    it('counts occurrences', () => {
        const engine = new Engine();
        const firstSentence = alignSentence('Once upon a time, in a galaxy far far away...');
        engine.appendSavedAlignment(firstSentence);
        expect(engine.primarySavedAlignmentFrequencyIndex["far"]['raf']).toEqual(2);
        expect(engine.primarySavedAlignmentFrequencyIndex["a"]['a']).toEqual(2);
        expect(engine.primarySavedAlignmentFrequencyIndex["in"]['ni']).toEqual(1);

        const secondSentence = alignSentence('Once upon a time');
        engine.appendSavedAlignment(secondSentence);
        expect(engine.primarySavedAlignmentFrequencyIndex["far"]['raf']).toEqual(2);
        expect(engine.primarySavedAlignmentFrequencyIndex["a"]['a']).toEqual(3);
        expect(engine.primarySavedAlignmentFrequencyIndex["in"]['ni']).toEqual(1);
    });
});


describe('append corpus', () => {
    it('is not implemented', () => {
        const engine = new Engine();
        expect(engine.appendCorpus).toThrow(new NotImplemented());
    });
});
