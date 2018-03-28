jest.mock('../DataIndex');
import Engine from '../Engine';
import NotImplemented from '../errors/NotImplemented';
import {alignSentence, MockAlgorithm} from './testUtils';
import {mockAddAlignments} from "../DataIndex";

describe('append corpus', () => {
    it('is not implemented', () => {
        const engine = new Engine();
        expect(engine.addCorpus).toThrow(NotImplemented);
    });
});

it('registers an algorithm', () => {
    const engine = new Engine();
    const algorithm = new MockAlgorithm();
    engine.registerAlgorithm(algorithm);
    expect(engine.algorithms).toEqual([algorithm]);
});

it('adds the alignment to the index', () => {
    const sentence = alignSentence('Once upon a time');
    const engine = new Engine();
    engine.addAlignments(sentence);
    expect(mockAddAlignments).toBeCalledWith(sentence);
});
