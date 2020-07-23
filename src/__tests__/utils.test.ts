// see './handlers.test'
jest.mock("../users.json");

import mockAxios from "axios";
import {
  splitMessage,
  getUser,
  getGIF,
  convertEmoji,
  replaceEmojis,
} from "../utils";

describe("relate slack id with actual user", () => {
  it("gets sender key id", function () {
    const event = {
      user: "U0138KPPPP1",
    };

    const { key } = getUser(event.user);
    expect(key).toBe(1);
  });

  it("returns undefined if not found", () => {
    const event = {
      user: "U0138KAPPP1",
    };

    const user = getUser(event.user);
    expect(user).toBeUndefined();
  });

  it("gets username from slack id", () => {
    const event = {
      user: "U0138KPPPP1",
    };

    const { name } = getUser(event.user);
    expect(name).toBe("Brenno");
  });
});

describe("split message in receiver and description", () => {
  it("strips receiver id", () => {
    const id = "U013GNX05AA";
    const event = {
      message: `<@${id}> mandou bem fazendo x`,
    };

    const { receivers } = splitMessage(event.message);
    expect(receivers).toEqual([id]);
  });

  it("strips description", () => {
    const message = "<@U013GNX05AA> mandou bem me ajudando";
    const { text: description } = splitMessage(message);
    expect(description).toBe("mandou bem me ajudando");
  });

  it("identifies all receivers", () => {
    const message =
      "<@U013GNX05AA> <@U0138KPPPP1> mandou bem ajudando o trainee mais cedo";
    const { text: description, receivers } = splitMessage(message);
    expect(description).toBe("mandou bem ajudando o trainee mais cedo");
    expect(receivers).toEqual(["U013GNX05AA", "U0138KPPPP1"]);
  });
});

describe("emoji converter", () => {
  it("replaces emoji shorthand with proper emoji", () => {
    const emoji = convertEmoji(":thumbsup:");
    expect(emoji).toBe("👍");
  });

  it("is itself if not found", () => {
    const string = convertEmoji("anything");
    expect(string).toBe("anything");
  });

  it("converts strings with shorthands to emojis", () => {
    const text = "Mandou bem: me ajudando :thumbsup: :grinning:";
    const withEmojis = replaceEmojis(text);
    expect(withEmojis).toBe("Mandou bem: me ajudando 👍 😀");
  });

  it("does not convert non-emojis", () => {
    const text = "Mandou bem :feliz:";
    const afterReplace = replaceEmojis(text);
    expect(afterReplace).toBe(text);
  });
});

describe("getting fallback images", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles sucessful api call", async () => {
    mockAxios.get.mockImplementation(() =>
      Promise.resolve({
        data: {
          data: {
            image_url: "giphy.gif",
          },
        },
      })
    );

    const image = await getGIF();

    expect(mockAxios.get).toBeCalledTimes(1);
    expect(image).toBe("giphy.gif");
  });

  it("handles api failure", async () => {
    mockAxios.get.mockImplementation(() =>
      Promise.reject(new Error("erorr 😥"))
    );

    console.error = jest.fn();

    const image = await getGIF();

    expect(mockAxios.get).toBeCalledTimes(1);
    expect(console.error).toBeCalledTimes(1);
    expect(image).toBe("https://media.giphy.com/media/oBPOP48aQpIxq/giphy.gif");
  });
});

