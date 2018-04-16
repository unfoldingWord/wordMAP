export default class Suggestion {

  public confidence: number = 0;

  public compoundConfidence() {
    return this.confidence;
  }
}

/**
 * Generates a mock suggestion
 * @param {number} confidence
 * @return {Suggestion}
 */
export function genSuggestion(confidence: number) {
  const s = new Suggestion();
  s.confidence = confidence;
  return s;
}
