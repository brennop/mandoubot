import { splitMessage, getUserKey } from "./handlers";

it("should get sender key id", function () {
  const event = {
    user: "U0138KPPPP1",
  };

  const key = getUserKey(event.user);
  expect(key).toBe(1);
});

it("should be undefined if not found", function () {
  const event = {
    user: "U0138KAPPP1",
  };

  const key = getUserKey(event.user);
  expect(key).toBe(undefined);
});

it("should strip receiver id", function () {
  const id = "U013GNX05AA";
  const event = {
    message: `<@${id}> mandou bem fazendo x`,
  };

  const { receiver } = splitMessage(event.message);
  expect(receiver).toBe(id);
});

it("should strip description", function () {
  const message = "<@U013GNX05AA> mandou bem me ajudando";
  const { description } = splitMessage(message);
  expect(description).toBe("mandou bem me ajudando");
});

