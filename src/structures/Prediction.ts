import Index from "../index/Index";
import Alignment from "./Alignment";

/**
 * Represents a single alignment prediction
 */
export default class Prediction {
  private alignment: Alignment;
  private scores: Index;

  constructor(alignment: Alignment) {
    this.scores = new Index();
    this.alignment = alignment;
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
