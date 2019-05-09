import WordMap from "../WordMap";

describe("Align Greek Sources", () => {
  it("aligns Wescott Hort to UGNT", () => {
    // This demonstrates aligning greek texts with some minor differences together.
    const ugnt = "βίβλος γενέσεως Ἰησοῦ Χριστοῦ υἱοῦ Δαυεὶδ υἱοῦ Ἀβραάμ";
    const wh = "βιβλος γενεσεως ιησου χριστου υιου δαυιδ extraword υιου αβρααμ";

    const map = new WordMap();
    map.appendCorpusString(ugnt, wh);
    const suggestions = map.predict(ugnt, wh);
    console.log(suggestions[0].toString());
  });
});
