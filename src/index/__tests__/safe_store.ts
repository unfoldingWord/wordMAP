import SafeStore from "../SafeStore";

describe("SafeStore", () => {
  it("writes", () => {
    const store = new SafeStore();
    store.write("hello world", "my", "path");
    expect(store.store).toEqual({
      "my": {
        "path": "hello world"
      }
    });

    store.write(3, "my", "value");
    expect(store.store).toEqual({
      "my": {
        "path": "hello world",
        "value": 3
      }
    });
  });

  it("reads", () => {
    const initialState = {
      "my": {
        "path": "hello world",
        "key": 3
      },
      "hi": "jon"
    };
    const store = new SafeStore(initialState);
    expect(store.read()).toEqual(initialState);
    expect(store.read("missing")).toBeUndefined();
    expect(store.read("my")).toEqual(initialState["my"]);
    expect(store.read("my", "key")).toEqual(3);
  });
});
