import mockAxios from "axios";
import { onMessage } from "./handlers";

beforeEach(() => {
  jest.clearAllMocks();
});

it("calls axios with basic information", async () => {
  const event = {
    user: "U0138KPPPP1",
    text: "<@U013GNX05AA> mandou bem me ajudando",
  };
  await onMessage(event);
  expect(mockAxios.post).toBeCalledTimes(1);
  expect(mockAxios.post).toBeCalledWith("/did_goods", {
    sender_id: 1,
    receiver_id: 2,
    description: "mandou bem me ajudando",
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
