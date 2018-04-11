import Prediction from "./Prediction";

/**
 * A translation suggestion
 */
export default class Suggestion {
  private predictions: Prediction[];

  constructor() {
    this.predictions = [];
  }

  /**
   * Adds a prediction to the suggestion.
   * @param {Prediction} prediction
   */
  public addPrediction(prediction: Prediction) {
    this.predictions.push(prediction);

    // sort by token position
    this.predictions = this.predictions.sort((a, b) => {
      const aPos = a.alignment.source.tokenPosition;
      const bPos = b.alignment.source.tokenPosition;
      if (aPos < bPos) {
        return -1;
      }
      if (aPos > bPos) {
        return 1;
      }
      return 0;
    });
  }

  public getPredictions() {
    return this.predictions;
  }

  /**
   * Returns the compounded confidence score of all predictions within the suggestion.
   * @return {number}
   */
  public compoundConfidence() {
    let confidence = 0;
    for (const p of this.predictions) {
      confidence += p.getScore("confidence");
    }
    return confidence;
  }
}
