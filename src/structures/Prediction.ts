import Index from "../index/Index";
import Alignment from "./Alignment";

/**
 * Represents a single alignment prediction
 */
export default class Prediction {
  private possibleAlignment: Alignment;
  private scores: Index;

  /**
   * Returns an array of score keys
   * @return {string[]}
   */
  get scoreKeys() {
    return Object.keys(this.scores.read());
  }

  /**
   * Returns the alignment represented by this prediction
   * @return {Alignment}
   */
  get alignment() {
    return this.possibleAlignment;
  }

  /**
   * Instantiates a new alignment prediction
   * @param {Alignment} alignment - the alignment for which a prediction will be calculated
   */
  constructor(alignment: Alignment) {
    this.scores = new Index();
    this.possibleAlignment = alignment;
  }

  /**
   * Sets a score for this prediction
   * @param {string} key - the score key
   * @param {number} value - the score value
   */
  public setScore(key: string, value: number) {
    this.scores.write(value, key);
  }

  /**
   * Reads a score from this prediction.
   * @param {string} key - the score key
   * @return {number} - the score value
   */
  public getScore(key: string): number {
    const score = this.scores.read(key);
    if (score === undefined) {
      throw new Error(`Unknown score key ${key}`);
    } else {
      return score;
    }
  }
}
