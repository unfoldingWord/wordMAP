/**
 * Represents a single token from a text.
 */
export default class Token {

  private text: string;
  private pos: number;
  private charPos: number;

  /**
   * Returns the {@link Token} position of the token within the sentence.
   * @return {number}
   */
  get position() {
    return this.pos;
  }

  /**
   * Returns the character position of the token within the sentence.
   * @return {number}
   */
  get charPosition() {
    return this.charPos;
  }

  /**
   *
   * @param {string} text - The text of the token.
   * @param {number} [tokenPosition = 0] - the position of the n-gram within the sentence measured in {$link Token}'s
   * @param {number} [characterPosition = 0] - The token's position within the sentence measured in characters.
   */
  constructor(text: string = "", tokenPosition = 0, characterPosition = 0) {
    this.text = text;
    this.pos = tokenPosition;
    this.charPos = characterPosition;
  }

  /**
   * Returns a human readable form of the token
   * @return {string}
   */
  public toString(): string {
    return this.text;
  }
}
