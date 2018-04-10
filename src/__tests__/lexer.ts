import Lexer from "../Lexer";

it("returns tokens from the sentence", () => {
  const tokens = Lexer.tokenize("hello world");
  const hello = tokens[0];
  const world = tokens[1];
  expect(hello.toString()).toEqual("hello");
  expect(hello.position).toEqual(0);
  expect(hello.charPosition).toEqual(0);

  expect(world.toString()).toEqual("world");
  expect(world.position).toEqual(1);
  expect(world.charPosition).toEqual(5);
});

it("returns tokens for an empty sentence", () => {
  const tokens = Lexer.tokenize("");
  expect(tokens.length).toEqual(0);
});
