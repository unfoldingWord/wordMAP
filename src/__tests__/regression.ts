import {WordMap} from "../core/WordMap";

describe("Regression Tests", () => {

  it("suggests tokens out of order of occurrence", () => {
    // We have found that sometimes tokens will be suggested out of order with it's occurrence.
    // The result is a mix of occurrences of the token in the predictions instead of a sequential occurrence.
    // This is due to the influence of alignment memory and is expected.
    const map = new WordMap();
    map.appendAlignmentMemoryString("Θεὸς", "the God");
    const source = "περὶ δὲ τῶν νεκρῶν, ὅτι ἐγείρονται, οὐκ ἀνέγνωτε ἐν τῇ βίβλῳ Μωϋσέως ἐπὶ τοῦ βάτου, πῶς εἶπεν αὐτῷ ὁ Θεὸς λέγων, ἐγὼ ὁ Θεὸς Ἀβραὰμ, καὶ ὁ Θεὸς Ἰσαὰκ, καὶ ὁ Θεὸς Ἰακώβ?";
    const target = "But concerning the dead that are raised, have you not read in the book of Moses, in the account about the bush, how God spoke to him, saying, ‘I am the God of Abraham and the God of Isaac and the God of Jacob’?";
    const suggestions = map.predict(source, target);
    const predictions = suggestions[0].getPredictions();

    // this should have the first occurrence of God
    expect(predictions[19].alignment.key).toEqual("n:θεὸς->n:the:god");
    const token = predictions[19].alignment.targetNgram.getTokens()[1];
    expect(token.toString()).toEqual("God");
    expect(token.occurrence).toEqual(2);

    // this should have the second occurrence of God
    expect(predictions[24].alignment.key).toEqual("n:ἀβραὰμ->n:god");
    const token2 = predictions[24].alignment.targetNgram.getTokens()[0];
    expect(token2.toString()).toEqual("God");
    expect(token2.occurrence).toEqual(1);
  });

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
