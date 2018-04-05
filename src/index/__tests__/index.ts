import Index from "../Index";

describe("Index", () => {
  it("writes", () => {
    const store = new Index();
    store.write("hello world", "my", "path");
    expect(store.index).toEqual({
      "my": {
        "path": "hello world"
      }
    });

    store.write(3, "my", "value");
    expect(store.index).toEqual({
      "my": {
        "path": "hello world",
        "value": 3
      }
    });
  });

  it("appends", () => {
    const newData = {
      "cheese": "I love you"
    };
    const initialState = {
      "my": {
        "path": "hi",
      },
      "hello": "jon"
    };
    const store = new Index(initialState);

    store.append(newData, "my");
    expect(store.index).toEqual({
      "my": {
        "path": "hi",
        "cheese": "I love you"
      },
      "hello": "jon"
    });

    const fail = () => {
      store.append(newData, "hello");
    };
    expect(fail).toThrow(TypeError);

  });

  it("reads", () => {
    const initialState = {
      "my": {
        "path": "hello world",
        "key": 3
      },
      "hi": "jon"
    };
    const store = new Index(initialState);
    expect(store.read()).toEqual(initialState);
    expect(store.read("missing")).toBeUndefined();
    expect(store.read("my")).toEqual(initialState["my"]);
    expect(store.read("my", "key")).toEqual(3);
  });

  it("sums", () => {
    const initialState = {
      "my": {
        "path": 2,
        "key": 3
      },
      "hi": 1,
      "something": {
        "strange": "yo!",
        "deep": {
          "test": 7
        },
        "ok": 2
      }
    };
    const store = new Index(initialState);
    expect(store.readSum("my")).toEqual(5);
    expect(store.readSum("something")).toEqual(2);
    expect(store.readSum("hi")).toEqual(1);
  });
});
