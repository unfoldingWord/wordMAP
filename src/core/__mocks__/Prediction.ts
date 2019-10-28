export class Prediction {
  public confidence: number = 0;

  public getScore(key: string): number {
    if (key === "confidence") {
      return this.confidence;
    } else {
      throw Error("Missing mock score key");
    }
  }
}

/**
 * Generates a mock prediction
 * @param {number} confidence
 * @return {Prediction}
 */
export function genPrediction(confidence: number) {
  const p = new Prediction();
  p.confidence = confidence;
  return p;
}
