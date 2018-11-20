import Uniqueness from "../Uniqueness";

describe("Uniqueness", () => {

  it("has prefect similarity and low uniqueness", () => {
    const sourceFrequency = 80;
    const targetFrequency = 80;
    const sourceTokenLength = 100;
    const targetTokenLength = 100;
    const phrasePlausibility = 1;

    const result = Uniqueness.calc(sourceFrequency, targetFrequency, sourceTokenLength, targetTokenLength, phrasePlausibility);
    expect(result).toEqual(0);
  });

  it("has high similarity and low uniqueness", () => {
    const sourceFrequency = 80;
    const targetFrequency = 80;
    const sourceTokenLength = 120;
    const targetTokenLength = 100;
    const phrasePlausibility = 1;

    const result = Uniqueness.calc(sourceFrequency, targetFrequency, sourceTokenLength, targetTokenLength, phrasePlausibility);
    expect(result).toEqual(0);
  });

  it("has low similarity and uniqueness", () => {
    const sourceFrequency = 100;
    const targetFrequency = 2;
    const sourceTokenLength = 150;
    const targetTokenLength = 100;
    const phrasePlausibility = 1;

    const result = Uniqueness.calc(sourceFrequency, targetFrequency, sourceTokenLength, targetTokenLength, phrasePlausibility);
    expect(result).toEqual(0.03);
  });

  it("has high similarity and uniqueness", () => {
    const sourceFrequency = 2;
    const targetFrequency = 2;
    const sourceTokenLength = 150;
    const targetTokenLength = 100;
    const phrasePlausibility = 1;

    const result = Uniqueness.calc(sourceFrequency, targetFrequency, sourceTokenLength, targetTokenLength, phrasePlausibility);
    expect(result).toEqual(1);
  });

  it("has high similarity and perfect uniqueness", () => {
    const sourceFrequency = 1;
    const targetFrequency = 1;
    const sourceTokenLength = 150;
    const targetTokenLength = 100;
    const phrasePlausibility = 1;

    const result = Uniqueness.calc(sourceFrequency, targetFrequency, sourceTokenLength, targetTokenLength, phrasePlausibility);
    expect(result).toEqual(1);
  });

  it("has perfect similarity and uniqueness", () => {
    const sourceFrequency = 1;
    const targetFrequency = 1;
    const sourceTokenLength = 100;
    const targetTokenLength = 100;
    const phrasePlausibility = 1;

    const result = Uniqueness.calc(sourceFrequency, targetFrequency, sourceTokenLength, targetTokenLength, phrasePlausibility);
    expect(result).toEqual(1);
  });
});
