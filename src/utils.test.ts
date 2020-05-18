import mockAxios from "axios";
import { splitMessage, getUser, getGIF } from "./utils";

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

    const { receiver } = splitMessage(event.message);
    expect(receiver).toBe(id);
  });

  it("strips description", () => {
    const message = "<@U013GNX05AA> mandou bem me ajudando";
    const { description } = splitMessage(message);
    expect(description).toBe("mandou bem me ajudando");
  });

  it("replaces slack ids with names", () => {
    const message = "<@U013GNX05AA> mandou bem ajudando o <@U0138KPPPP1>";
    const { description } = splitMessage(message);
    expect(description).toBe("mandou bem ajudando o Brenno");
  });

  it("identifies start of message", () => {
    const message =
      "Galera, queria avisar que o <@U013GNX05AA> mandou bem ajudando o <@U0138KPPPP1>";
    const { receiver, description } = splitMessage(message);
    expect(receiver).toBe("U013GNX05AA");
    expect(description).toBe("mandou bem ajudando o Brenno");
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
