import mongoose from ".";
import User from "./user";

beforeAll(async () => {
  await User.remove({});
});

afterEach(async () => {
  await User.remove({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

it("has a module", () => {
  expect(User).toBeDefined();
});

it("creates a user", async () => {
  const user = new User({ name: "NickNish", slack_id: "1234", key: "1" });
  const saved = await user.save();

  expect(saved.name).toBe("NickNish");
});

it("finds an user", async () => {
  const user = new User({ name: "NickNish", slack_id: "1234", key: "1" });
  await user.save();

  const foundUser = await User.findOne({ slack_id: "1234" });
  expect(foundUser.name).toBe("NickNish");
});

it("updates a user", async () => {
  const user = new User({ name: "NickNish", slack_id: "1234", key: "1" });
  await user.save();

  user.key = "2";
  await user.save();

  const foundUser = await User.findOne({ slack_id: "1234" });
  expect(foundUser.key).toBe("2");
});
