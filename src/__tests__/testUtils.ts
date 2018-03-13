//@ts-ignore
import stringTokenizer from 'string-punctuation-tokenizer';
import Token from '../structures/Token';
import Ngram from '../structures/Ngram';
import Alignment from "../structures/Alignment";

/**
 * Generates a sample alignment from a sentence
 * @param {String} sentence
 * @return {Array<Alignment>}
 */
export function alignSentence(sentence: String): Array<Alignment> {
    let alignments:Array<Alignment> = [];
    const tokens = tokenizeSentence(sentence);
    while(tokens.length) {
        const ngramLength = randNgramLength(tokens.length, 1);
        alignments = [
            ...alignments,
            alignTokens(tokens.slice(0, ngramLength))
        ];
        tokens.splice(0, ngramLength)
    }

    return alignments;
}

/**
 * Generates a sample alignment
 * @param {Array<Token>} tokens - An array of tokens to align
 */
function alignTokens(tokens: Array<Token>): Alignment {
    const source = new Ngram(tokens);
    const flippedTokens:Array<Token> = [];
    for(const token of tokens) {
        flippedTokens.push(new Token(token.toString().split('').reverse().join('')));
    }
    const target = new Ngram(flippedTokens);
    return new Alignment(source, target);
}

/**
 * Converts a sentence to an array of Tokens
 * @param {String} sentence
 * @return {Array<Token>}
 */
function tokenizeSentence(sentence: String): Array<Token> {
    const words = stringTokenizer.tokenize(sentence);
    const tokens: Array<Token> = [];
    for (const word of words) {
        tokens.push(new Token(word));
    }
    return tokens;
}

/**
 * Generates the length of an n-gram.
 * n-grams are limited to lengths of 3.
 * @param {number} numTokens - the number of tokens available for use in the n-gram. This ensures we don't introduce out of bounds errors.
 * @param {number} [maxLength=3] - the maximum length of the n-gram
 * @return {number}
 */
function randNgramLength(numTokens:number, maxLength:number=3):number {
    const ceiling = Math.min(numTokens, maxLength);
    return Math.floor(Math.random() * ceiling) + 1;
}
