import MAP from "../index";

describe("MAP", () => {
  it("has no corpus", () => {
    // TODO: this needs some work
    const map = new MAP();
    const suggestions = map.predict("hello", "olleh dlrow");
    expect(suggestions.length).toEqual(1);

    const s1 = suggestions[0];
    expect(s1.getPredictions().length).toEqual(1);
    expect(s1.getPredictions()[0].alignment.key).toEqual("n:hello->n:dlrow");
  });

  it("has some corpus", () => {
    // TODO: this needs some work
    const map = new MAP();
    map.appendCorpus("once hello what", "ecno olleh dlrow tahw");
    map.appendCorpus("once hello what", "ecno olleh dlrow tahw");
    map.appendCorpus("once hello what", "ecno olleh dlrow tahw");
    map.appendCorpus("once hello what", "ecno olleh dlrow tahw");
    const suggestions = map.predict("hello world", "olleh dlrow nhoj");
    expect(suggestions.length).toEqual(1);

    const s1 = suggestions[0];
    expect(s1.getPredictions().length).toEqual(2);
    expect(s1.getPredictions()[0].alignment.key).toEqual("n:hello->n:nhoj");
    expect(s1.getPredictions()[1].alignment.key).toEqual("n:world->n:olleh:dlrow");
  });
});
