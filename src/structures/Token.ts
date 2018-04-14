/**
 * Represents a single token from a text.
 */
export default class Token {

  private text: string;
  private tokenPos: number;
  private charPos: number;
  private sentenceCharLen: number;
  private sentenceTokenLen: number;

  /**
   * Returns the position (in units of {@link Token}) of the token within the sentence.
   * @return {number}
   */
  get position() {
    return this.tokenPos;
  }

  /**
   * The length of the sentence (in units of character) in which this token occurs.
   */
  get sentenceCharacterLength() {
    return this.sentenceCharLen;
  }

  /**
   * The length of the sentence (in units of {@link Token}) in which this token occurs.
   */
  get sentenceTokenLength() {
    return this.sentenceTokenLen;
  }

  /**
   * Returns the position (in units of character) of the token within the sentence.
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
   * @param sentenceTokenLen - the length of the sentence measured in {@link Token}'s
   * @param sentenceCharLen - the length of the sentence measured in characters.
   */
  constructor(text: string = "", tokenPosition = 0, characterPosition = 0, sentenceTokenLen = 0, sentenceCharLen = 0) {
    this.text = text;
    if (tokenPosition < 0 || characterPosition < 0) {
      throw new Error("Position cannot be less than 0");
    }
    if (sentenceTokenLen <= 0 || sentenceCharLen <= 0) {
      throw new Error("Sentence length cannot be 0");
    }

    this.tokenPos = tokenPosition;
    this.charPos = characterPosition;
    this.sentenceCharLen = sentenceCharLen;
    this.sentenceTokenLen = sentenceTokenLen;
  }

  /**
   * Returns a human readable form of the token
   * @return {string}
   */
  public toString(): string {
    return this.text;
  }

  /**
   * Checks if two tokens are linguistically equal
   * @param {Token} token - the token to compare
   * @return {boolean}
   */
  public equals(token: Token): boolean {
    return this.toString() === token.toString()
      && this.position === token.position;
  }
}
