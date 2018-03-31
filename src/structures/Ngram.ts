import Token from "./Token";

/**
 * Represents a set of zero or more tokens from a text.
 */
export default class Ngram {

  private tokens: Token[];
  private positionInSentence: number;

  /**
   * @param {Array<Token>} [tokens=[]] - a list of tokens of which this n-gram is composed
   * @param {number} position - the position of the n-gram within the sentence.
   */
  constructor(tokens: Token[] = [], position = 0) {
    this.tokens = tokens;
    this.positionInSentence = position;
  }

  /**
   * Returns the position at which this n-gram appears in the sentence.
   * @return {number}
   */
  get position() {
    return this.positionInSentence;
  }

  /**
   * Returns a human readable form of the n-gram.
   * @return {string}
   */
  public toString(): string {
    const tokenValues = [];
    for (const token of this.tokens) {
      tokenValues.push(token.toString());
    }
    return tokenValues.join(":");
  }
}
