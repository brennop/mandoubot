import { splitMessage, getUserKey } from "./handlers";

describe("relate slack id with actual user", () => {
  it("gets sender key id", function () {
    const event = {
      user: "U0138KPPPP1",
    };

    const key = getUserKey(event.user);
    expect(key).toBe(1);
  });

  it("returns undefined if not found", () => {
    const event = {
      user: "U0138KAPPP1",
    };

    const key = getUserKey(event.user);
    expect(key).toBeUndefined();
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
});

