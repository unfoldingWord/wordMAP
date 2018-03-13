import Ngram from '../Ngram';
import Token from '../Token';

describe('creates an n-gram', () => {
    it('has a single token', () => {
        const ngram = new Ngram([new Token('hello')]);
        expect(ngram.toString()).toEqual('hello');
    });

    it('has multiple tokens', () => {
        const ngram = new Ngram([new Token('hello'), new Token('world')]);
        expect(ngram.toString()).toEqual('hello:world');
    });

    it('has some empty tokens', () => {
        const ngram = new Ngram([new Token(), new Token('hello'), new Token(), new Token('world')]);
        expect(ngram.toString()).toEqual(':hello::world');
    });
});