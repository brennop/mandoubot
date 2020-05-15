import { getUserKey } from "./handlers";

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
