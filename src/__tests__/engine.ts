import Engine from '../Engine';
import NotImplemented from '../errors/NotImplemented';
import {alignSentence, tokenizeSentence} from './testUtils';
import Token from "../structures/Token";
import Ngram from "../structures/Ngram";

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


describe('sentence n-grams', () => {
    const sentence = tokenizeSentence('In the beginning God created');
    it('reads sized n-grams', () => {
        const unigrams = Engine.readSizedNgrams(sentence, 1);
        expect(unigrams).toEqual([{"tokens": [{"text": "In"}]}, {"tokens": [{"text": "the"}]}, {"tokens": [{"text": "beginning"}]}, {"tokens": [{"text": "God"}]}]);

        const bigrams = Engine.readSizedNgrams(sentence, 2);
        expect(bigrams).toEqual([{"tokens": [{"text": "In"}, {"text": "the"}]}, {"tokens": [{"text": "the"}, {"text": "beginning"}]}, {"tokens": [{"text": "beginning"}, {"text": "God"}]}]);

        const trigrams = Engine.readSizedNgrams(sentence, 3);
        expect(trigrams).toEqual([{"tokens": [{"text": "In"}, {"text": "the"}, {"text": "beginning"}]}, {"tokens": [{"text": "the"}, {"text": "beginning"}, {"text": "God"}]}]);
    });
    it('generates all n-grams', () => {
        const ngrams = Engine.generateSentenceNgrams(sentence);
        expect(ngrams).toEqual([{"tokens": [{"text": "In"}]}, {"tokens": [{"text": "the"}]}, {"tokens": [{"text": "beginning"}]}, {"tokens": [{"text": "God"}]}, {"tokens": [{"text": "In"}, {"text": "the"}]}, {"tokens": [{"text": "the"}, {"text": "beginning"}]}, {"tokens": [{"text": "beginning"}, {"text": "God"}]}]);
    });
});

describe('alignment permutations', () => {
    it('generates permutations', () => {
        const primaryNgrams = [
            new Ngram(tokenizeSentence('In')),
            new Ngram(tokenizeSentence('the')),
            new Ngram(tokenizeSentence('beginning')),
            new Ngram(tokenizeSentence('In the')),
            new Ngram(tokenizeSentence('the beginning'))
        ];
        const secondaryNgrams = [
            new Ngram(tokenizeSentence('nI')),
            new Ngram(tokenizeSentence('eht')),
            new Ngram(tokenizeSentence('gninnigeb')),
            new Ngram(tokenizeSentence('nI eht')),
            new Ngram(tokenizeSentence('eht gninnigeb'))
        ];
        const permutations = Engine.generateAlignmentPermutations(primaryNgrams, secondaryNgrams);
        expect(permutations).toEqual([{"_sourceNgram": {"tokens": [{"text": "In"}]}, "_targetNgram": {"tokens": [{"text": "nI"}]}}, {"_sourceNgram": {"tokens": [{"text": "In"}]}, "_targetNgram": {"tokens": [{"text": "eht"}]}}, {"_sourceNgram": {"tokens": [{"text": "In"}]}, "_targetNgram": {"tokens": [{"text": "gninnigeb"}]}}, {"_sourceNgram": {"tokens": [{"text": "In"}]}, "_targetNgram": {"tokens": [{"text": "nI"}, {"text": "eht"}]}}, {"_sourceNgram": {"tokens": [{"text": "In"}]}, "_targetNgram": {"tokens": [{"text": "eht"}, {"text": "gninnigeb"}]}}, {"_sourceNgram": {"tokens": [{"text": "the"}]}, "_targetNgram": {"tokens": [{"text": "nI"}]}}, {"_sourceNgram": {"tokens": [{"text": "the"}]}, "_targetNgram": {"tokens": [{"text": "eht"}]}}, {"_sourceNgram": {"tokens": [{"text": "the"}]}, "_targetNgram": {"tokens": [{"text": "gninnigeb"}]}}, {"_sourceNgram": {"tokens": [{"text": "the"}]}, "_targetNgram": {"tokens": [{"text": "nI"}, {"text": "eht"}]}}, {"_sourceNgram": {"tokens": [{"text": "the"}]}, "_targetNgram": {"tokens": [{"text": "eht"}, {"text": "gninnigeb"}]}}, {"_sourceNgram": {"tokens": [{"text": "beginning"}]}, "_targetNgram": {"tokens": [{"text": "nI"}]}}, {"_sourceNgram": {"tokens": [{"text": "beginning"}]}, "_targetNgram": {"tokens": [{"text": "eht"}]}}, {"_sourceNgram": {"tokens": [{"text": "beginning"}]}, "_targetNgram": {"tokens": [{"text": "gninnigeb"}]}}, {"_sourceNgram": {"tokens": [{"text": "beginning"}]}, "_targetNgram": {"tokens": [{"text": "nI"}, {"text": "eht"}]}}, {"_sourceNgram": {"tokens": [{"text": "beginning"}]}, "_targetNgram": {"tokens": [{"text": "eht"}, {"text": "gninnigeb"}]}}, {"_sourceNgram": {"tokens": [{"text": "In"}, {"text": "the"}]}, "_targetNgram": {"tokens": [{"text": "nI"}]}}, {"_sourceNgram": {"tokens": [{"text": "In"}, {"text": "the"}]}, "_targetNgram": {"tokens": [{"text": "eht"}]}}, {"_sourceNgram": {"tokens": [{"text": "In"}, {"text": "the"}]}, "_targetNgram": {"tokens": [{"text": "gninnigeb"}]}}, {"_sourceNgram": {"tokens": [{"text": "In"}, {"text": "the"}]}, "_targetNgram": {"tokens": [{"text": "nI"}, {"text": "eht"}]}}, {"_sourceNgram": {"tokens": [{"text": "In"}, {"text": "the"}]}, "_targetNgram": {"tokens": [{"text": "eht"}, {"text": "gninnigeb"}]}}, {"_sourceNgram": {"tokens": [{"text": "the"}, {"text": "beginning"}]}, "_targetNgram": {"tokens": [{"text": "nI"}]}}, {"_sourceNgram": {"tokens": [{"text": "the"}, {"text": "beginning"}]}, "_targetNgram": {"tokens": [{"text": "eht"}]}}, {"_sourceNgram": {"tokens": [{"text": "the"}, {"text": "beginning"}]}, "_targetNgram": {"tokens": [{"text": "gninnigeb"}]}}, {"_sourceNgram": {"tokens": [{"text": "the"}, {"text": "beginning"}]}, "_targetNgram": {"tokens": [{"text": "nI"}, {"text": "eht"}]}}, {"_sourceNgram": {"tokens": [{"text": "the"}, {"text": "beginning"}]}, "_targetNgram": {"tokens": [{"text": "eht"}, {"text": "gninnigeb"}]}}]);
    });
});

describe('append corpus', () => {
    it('is not implemented', () => {
        const engine = new Engine();
        expect(engine.appendCorpus).toThrow(NotImplemented);
    });
});
