export interface KeyValueStore {
  [key: string]: any;
}

export default class CorpusFaker {

  private static random(min: number, max: number): number {
    return Math.floor(Math.random() * max) + min;
  }

  private static character(index: number): string {
    return "abcdefghijklmnopqrstuvwxyz"[index];
  }

  private static randomCharacter(): string {
    return this.character(CorpusFaker.random(0, 25));
  }

  private static randomWord(maxLength: number = 5): string {
    const word = [];
    const length = CorpusFaker.random(1, maxLength);
    for (let i = 0; i < length; i++) {
      word.push(CorpusFaker.randomCharacter());
    }
    return word.join("");
  }

  private static randomPhrase(maxWords: number, maxWordLength: number): string {
    if (typeof maxWords === "undefined") {
      throw Error("Must pass in maxWords.");
    }
    if (typeof maxWordLength === "undefined") {
      throw Error("Must pass in maxWordLength.");
    }
    const phrase = [];
    const length = CorpusFaker.random(1, maxWords);
    for (let i = 0; i < length; i++) {
      const word = CorpusFaker.randomWord(maxWordLength);
      phrase.push(word);
    }
    return phrase.join(" ");
  }

  private static lexiconSentencePair(maxPhrases: number, lexicon: KeyValueStore) {
    if (typeof maxPhrases === "undefined") {
      throw Error("Must pass in maxPhrases.");
    }
    if (typeof lexicon !== "object") {
      throw Error("Must pass in lexicon.");
    }
    const sourceArray = [];
    const targetArray = [];
    const times = CorpusFaker.random(1, maxPhrases);
    for (let i = 0; i < times; i++) {
      const sourcePhrases = Object.keys(lexicon);
      const randomSourcePhrase = sourcePhrases[Math.floor(Math.random() *
        sourcePhrases.length)];
      const targetTranslations = lexicon[randomSourcePhrase];
      const randomTargetTranslation = targetTranslations[Math.floor(Math.random() *
        targetTranslations.length)];
      sourceArray.push(randomSourcePhrase);
      targetArray.push(randomTargetTranslation);
      targetArray.sort();
    }
    sourceArray.push(".");
    targetArray.push(".");
    return [sourceArray.join(" "), targetArray.join(" ")];
  }

  private n: number;

  constructor(n: number = 3) {
    this.n = n;
  }

  public lexiconCorpusGenerate(length: number, lexicon: KeyValueStore): string[][] {
    const lines = [];
    for (let i = 0; i < length; i++) {
      const line = CorpusFaker.lexiconSentencePair(5, lexicon);
      lines.push(line);
    }
    return lines;
  }

  public lexicon(entryCount: number): KeyValueStore {
    if (typeof entryCount === "undefined") {
      throw Error("Must pass in entryCount.");
    }
    const lexicon: KeyValueStore = {};
    for (let i = 0; i < entryCount; i++) {
      const entry = this.lexiconEntry(3);
      lexicon[entry[0]] = entry[1];
    }
    return lexicon;
  }

  private lexiconEntry(maxTranslations: number): [string, string[]] {
    if (typeof maxTranslations === "undefined") {
      throw Error("Must pass in maxTranslations.");
    }
    const word = CorpusFaker.randomPhrase(this.n, 7);
    const translations = [];
    const translationCount = CorpusFaker.random(1, maxTranslations);
    for (let i = 0; i < translationCount; i++) {
      translations.push(CorpusFaker.randomPhrase(this.n, 7));
    }
    return [word, translations];
  }

}
