import Uniqueness from "../Uniqueness";

describe("Uniqueness", () => {
  it("has low uniqueness in both data sets", () => {
    const sourceFrequency = 30;
    const targetFrequency = 20;
    const sourceTokenLength = 150;
    const targetTokenLength = 100;
    const phrasePlausibility = 0.9;

    const result = Uniqueness.calc(sourceFrequency, targetFrequency, sourceTokenLength, targetTokenLength, phrasePlausibility);
    expect(result).toEqual(0); // this should be small
  });

  it("has dis-similar uniqueness", () => {
    const sourceFrequency = 30;
    const targetFrequency = 2;
    const sourceTokenLength = 150;
    const targetTokenLength = 100;
    const phrasePlausibility = 1;

    const result = Uniqueness.calc(sourceFrequency, targetFrequency, sourceTokenLength, targetTokenLength, phrasePlausibility);
    expect(result).toEqual(0); // this should be small
  });

  it("has good uniqueness", () => {
    const sourceFrequency = 3;
    const targetFrequency = 2;
    const sourceTokenLength = 150;
    const targetTokenLength = 100;
    const phrasePlausibility = 1;

    const result = Uniqueness.calc(sourceFrequency, targetFrequency, sourceTokenLength, targetTokenLength, phrasePlausibility);
    expect(result).toEqual(0.98);
  });

  it("has perfect uniqueness", () => {
    const sourceFrequency = 1;
    const targetFrequency = 1;
    const sourceTokenLength = 100;
    const targetTokenLength = 100;
    const phrasePlausibility = 1;

    const result = Uniqueness.calc(sourceFrequency, targetFrequency, sourceTokenLength, targetTokenLength, phrasePlausibility);
    expect(result).toEqual(0.99);
  });
});
