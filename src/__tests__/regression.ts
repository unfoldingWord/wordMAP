import WordMap from "../WordMap";

describe("Regression Tests", () => {

  // it("suggests", () => {
  //
  // });

  it("suggests the correct n-gram occurrence", () => {
    // later occurrences were being preferred over earlier ones.
    const map = new WordMap();
    map.appendAlignmentMemoryString("עִם", "with the");
    const source = "וְ⁠הָ⁠עִבְרִ֗ים הָי֤וּ לַ⁠פְּלִשְׁתִּים֙ כְּ⁠אֶתְמ֣וֹל שִׁלְשׁ֔וֹם אֲשֶׁ֨ר עָל֥וּ עִמָּ֛⁠ם בַּֽ⁠מַּחֲנֶ֖ה סָבִ֑יב וְ⁠גַם־ הֵ֗מָּה לִֽ⁠הְיוֹת֙ עִם־ יִשְׂרָאֵ֔ל אֲשֶׁ֥ר עִם־ שָׁא֖וּל וְ⁠יוֹנָתָֽן׃";
    const target = "Before that, some of the Hebrew men had deserted their army and gone to join with the Philistine army. But now those men revolted and joined with the Saul and Jonathan and the other Israelite soldiers.";
    const suggestions = map.predict(source, target);
    const predictions = suggestions[0].getPredictions()
      .filter((p) => p.confidence >= 1);
    expect(predictions[0].alignment.key).toEqual(predictions[1].alignment.key);
    // expect target tokens to be used in order
    expect(predictions[0].alignment.targetNgram.getTokens()[0].occurrence)
      .toEqual(1);
    expect(predictions[1].alignment.targetNgram.getTokens()[0].occurrence)
      .toEqual(2);
  });

  it("suggest the correct word occurrence", () => {
    // later occurrences were being preferred over earlier ones.
    const map = new WordMap();
    map.appendAlignmentMemoryString("עִם", "with");
    const source = "וְ⁠הָ⁠עִבְרִ֗ים הָי֤וּ לַ⁠פְּלִשְׁתִּים֙ כְּ⁠אֶתְמ֣וֹל שִׁלְשׁ֔וֹם אֲשֶׁ֨ר עָל֥וּ עִמָּ֛⁠ם בַּֽ⁠מַּחֲנֶ֖ה סָבִ֑יב וְ⁠גַם־ הֵ֗מָּה לִֽ⁠הְיוֹת֙ עִם־ יִשְׂרָאֵ֔ל אֲשֶׁ֥ר עִם־ שָׁא֖וּל וְ⁠יוֹנָתָֽן׃";
    const target = "Before that, some of the Hebrew men had deserted their army and gone to join with the Philistine army. But now those men revolted and joined with Saul and Jonathan and the other Israelite soldiers.";
    const suggestions = map.predict(source, target);
    const predictions = suggestions[0].getPredictions()
      .filter((p) => p.confidence >= 1);
    expect(predictions[0].alignment.key).toEqual(predictions[1].alignment.key);
    // expect target tokens to be used in order
    expect(predictions[0].alignment.targetNgram.getTokens()[0].occurrence)
      .toEqual(1);
    expect(predictions[1].alignment.targetNgram.getTokens()[0].occurrence)
      .toEqual(2);
  });
});
