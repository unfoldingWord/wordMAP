// @ts-ignore
import stringTokenizer from "string-punctuation-tokenizer";
import NumberObject from "./index/NumberObject";
import Token from "./structures/Token";

/**
 * A collection of lexical functions
 */
export default class Lexer {

  /**
   * Generates an array of measured tokens for the sentence.
   * @param {string} sentence - the sentence to tokenize
   * @return {Token[]}
   */
  public static tokenize(sentence: string): Token[] {
    const words = stringTokenizer.tokenize(sentence);
    const sentenceLength = sentence.length;
    const tokens: Token[] = [];
    let charPos = 0;
    const occurrenceIndex: NumberObject = {};
    for (const word of words) {
      if (!occurrenceIndex[word]) {
        occurrenceIndex[word] = 0;
      }
      occurrenceIndex[word] += 1;
      tokens.push(new Token({
        text: word,
        tokenPosition: tokens.length,
        characterPosition: charPos,
        sentenceTokenLen: words.length,
        sentenceCharLen: sentenceLength,
        occurrence: occurrenceIndex[word]
      }));
      charPos += word.length;
    }

    /**
     * Finish adding occurrence information
     * @type {any[]}
     */
    const occurrenceTokens: Token[] = [];
    for (const t of tokens) {
      occurrenceTokens.push(new Token({
        text: t.toString(),
        tokenPosition: t.position,
        characterPosition: t.charPosition,
        sentenceTokenLen: t.sentenceTokenLength,
        sentenceCharLen: t.sentenceCharacterLength,
        occurrence: t.occurrence,
        occurrences: occurrenceIndex[t.toString()]
      }));
    }
    return occurrenceTokens;
  }

}
