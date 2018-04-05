import Index from "../Index";

describe("Index", () => {
  it("writes", () => {
    const initialState = {
      "my": {
        "path": "hello world"
      }
    };
    const store = new Index(initialState);
    store.write(3, "my", "value");
    expect(store.index).toEqual({
      "my": {
        "path": "hello world",
        "value": 3
      }
    });
  });

  it("does not write to empty path", () => {
    const initialState = {
      "my": {
        "path": "hello world"
      }
    };
    const store = new Index(initialState);
    store.write(3);
    expect(store.index).toEqual({
      "my": {
        "path": "hello world"
      }
    });
  });

  it("appends to object", () => {
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
  });

  it("appends deeply", () => {
    const newData = {
      "cheese": "I love you"
    };
    const initialState = {
      "my": {
        "path": {
          "deep": "value"
        }
      },
      "hello": "jon"
    };
    const store = new Index(initialState);

    store.append(newData, "my", "path");
    expect(store.index).toEqual({
      "my": {
        "path": {
          "deep": "value",
          "cheese": "I love you"
        },
      },
      "hello": "jon"
    });
  });

  it("appends new path", () => {
    const newData = {
      "cheese": "I love you"
    };
    const initialState = {
      "my": {
        "path": {
          "deep": "value"
        }
      },
      "hello": "jon"
    };
    const store = new Index(initialState);

    store.append(newData, "new", "path");
    expect(store.index).toEqual({
      "my": {
        "path": {
          "deep": "value"
        },
      },
      "new": {
        "path": {
          "cheese": "I love you"
        }
      },
      "hello": "jon"
    });
  });

  it("does not append to empty path", () => {
    const newData = {
      "cheese": "I love you"
    };
    const initialState = {
      "my": {
        "path": {
          "deep": "value"
        }
      },
      "hello": "jon"
    };
    const store = new Index(initialState);

    store.append(newData);
    expect(store.index).toEqual(initialState);
  });

  it("cannot append to non-object", () => {
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
