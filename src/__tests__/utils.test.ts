import mockAxios from "axios";
import {
  splitMessage,
  getUser,
  getGIF,
  convertEmoji,
  replaceEmojis,
} from "../utils";
import User from "../db/user";
import mongoose from "../db";

beforeAll(async () => {
  await User.remove({});
  await User.create({ name: "Brenno", slack_id: "U0138KPPPP1", key: "1" });
  await User.create({ name: "Dieguin", slack_id: "U013GNX05AA", key: "2" });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("relate slack id with actual user", () => {
  it("gets sender key id", async () => {
    const { key } = await User.findOne({ slack_id: "U0138KPPPP1" });
    expect(key).toBe("1");
  });

  it("is falsy if not found", async () => {
    const user = await getUser("something");
    expect(user).toBeFalsy();
  });
});

describe("split message in receiver and description", () => {
  it("strips receiver id", async () => {
    const id = "U013GNX05AA";
    const event = {
      message: `<@${id}> mandou bem fazendo x`,
    };

    const { receiver } = await splitMessage(event.message);
    expect(receiver).toBe(id);
  });

  it("strips description", async () => {
    const message = "<@U013GNX05AA> mandou bem me ajudando";
    const { text: description } = await splitMessage(message);
    expect(description).toBe("mandou bem me ajudando");
  });

  it("replaces slack ids with names", async () => {
    const message = "<@U013GNX05AA> mandou bem ajudando o <@U0138KPPPP1>";
    const { text: description } = await splitMessage(message);
    expect(description).toBe("mandou bem ajudando o Brenno");
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
      Promise.reject(new Error("error 😥"))
    );

    console.error = jest.fn();

    const image = await getGIF();

    expect(mockAxios.get).toBeCalledTimes(1);
    expect(console.error).toBeCalledTimes(1);
    expect(image).toBe("https://media.giphy.com/media/oBPOP48aQpIxq/giphy.gif");
  });
});
