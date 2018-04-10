// @ts-ignore
import stringTokenizer from "string-punctuation-tokenizer";
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
    const tokens: Token[] = [];
    let charPos = 0;
    for (const word of words) {
      tokens.push(new Token(word, tokens.length, charPos));
      charPos += word.length;
    }
    return tokens;
  }

}
