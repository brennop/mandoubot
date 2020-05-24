import mockAxios from "axios";
import { onMessage } from "../handlers";
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

describe("onMessage handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls axios with basic information", async () => {
    const event = {
      user: "U0138KPPPP1",
      text: "<@U013GNX05AA> mandou bem me ajudando",
    };

    mockAxios.get.mockImplementation(() =>
      Promise.resolve({
        data: {
          data: {
            image_url: "giphy.gif",
          },
        },
      })
    );

    await onMessage(event);
    expect(mockAxios.post).toBeCalledTimes(1);
    expect(mockAxios.post).toBeCalledWith("/did_goods", {
      sender_id: "1",
      receiver_id: "2",
      description: "mandou bem me ajudando",
      photo: "giphy.gif",
    });
  });

  it("stops when message is a reply/something else", async () => {
    const event = {
      subtype: "message_replied",
      user: "U0138KPPPP1",
      text: "<@U013GNX05AA> mandou bem me ajudando",
    };
    await onMessage(event);
    expect(mockAxios.post).not.toBeCalled();
  });

  it("continues if subtype is file_share", async () => {
    const event = {
      subtype: "file_share",
      user: "U0138KPPPP1",
      text: "<@U013GNX05AA> mandou bem me ajudando",
    };
    await onMessage(event);
    expect(mockAxios.post).toBeCalled();
  });

  it("calls axios with attached file", async () => {
    const event = {
      subtype: "file_share",
      user: "U0138KPPPP1",
      text: "<@U013GNX05AA> mandou bem me ajudando",
      files: [{ url_private: "image.jpg" }],
    };
    await onMessage(event);
    expect(mockAxios.post).toBeCalledWith("/did_goods", {
      sender_id: "1",
      receiver_id: "2",
      description: "mandou bem me ajudando",
      photo: "image.jpg",
    });
  });

  it("catches with error when sender is not found", async () => {
    const event = {
      subtype: "file_share",
      user: "<@U013GNX06AA>",
    };

    expect.assertions(1);
    return onMessage(event).catch((error) =>
      expect(error).toMatch("User not found")
    );
  });
});
