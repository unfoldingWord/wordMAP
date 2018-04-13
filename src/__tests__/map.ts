import * as fs from "fs-extra";
import CorpusFaker from "../../dist/util/CorpusFaker";
import MAP from "../index";

describe("MAP", () => {
  it("has no corpus", () => {
    const map = new MAP();
    const suggestions = map.predict("hello", "olleh dlrow");
    expect(suggestions.length).toEqual(1);

    const s1 = suggestions[0];
    expect(s1.getPredictions().length).toEqual(1);
    expect(s1.getPredictions()[0].alignment.key).toEqual("n:hello->n:dlrow");
  });

  it("has some corpus", () => {
    const map = new MAP();
    map.appendCorpusString("once hello what", "ecno olleh dlrow tahw");
    map.appendCorpusString("once hello what", "ecno olleh dlrow tahw");
    map.appendCorpusString("once hello what", "ecno olleh dlrow tahw");
    map.appendCorpusString("once hello what", "ecno olleh dlrow tahw");
    const suggestions = map.predict("hello world", "olleh dlrow nhoj");
    expect(suggestions.length).toEqual(1);

    const s1 = suggestions[0];
    expect(s1.getPredictions().length).toEqual(2);
    expect(s1.getPredictions()[0].alignment.key).toEqual("n:hello->n:nhoj");
    expect(s1.getPredictions()[1].alignment.key).toEqual(
      "n:world->n:olleh:dlrow");
  });

  it("reads in some fake corpus", () => {
    const faker = new CorpusFaker();
    const lexicon = faker.lexicon(10);
    const corpus = faker.lexiconCorpusGenerate(10000, lexicon);
    const unalignedPair = corpus.pop() || [];

    const map = new MAP();
    map.appendCorpus(corpus);
    const suggestions = map.predict(unalignedPair[0], unalignedPair[1]);

    const s = suggestions[0].toString();
    expect(suggestions[0]).toHaveLength(1);

    // 0 n:oqwbajt:kfjy->n:dcu|0,n:feid->n:dcu|0
  });

  it("reads in some real corpus", () => {
    const sourceCorpus = fs.readFileSync("fixtures/corpus/greek.txt");
    const targetCorpus = fs.readFileSync("fixtures/corpus/english.txt");

    const map = new MAP();
    map.appendCorpusString(sourceCorpus.toString("utf-8"), targetCorpus.toString("utf-8"));

    const unalignedPair = [
      "Βίβλος γενέσεως Ἰησοῦ Χριστοῦ υἱοῦ Δαυὶδ υἱοῦ Ἀβραάμ.",
      "The book of the genealogy of Jesus Christ, son of David, son of Abraham:"
    ];
    const suggestions = map.predict(unalignedPair[0], unalignedPair[1]);

    const s = suggestions[0].toString();
    expect(suggestions[0]).toHaveLength(1);
  });
});
