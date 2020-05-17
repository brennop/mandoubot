import mockAxios from "axios";
import { onMessage } from "./handlers";

it("calls axios with basic information", () => {
  const event = {
    user: "U0138KPPPP1",
    text: "<@U013GNX05AA> mandou bem me ajudando",
  };
  onMessage(event);
  expect(mockAxios.post).toBeCalledWith("/did_goods", {
    sender_id: 1,
    receiver_id: 2,
    description: "mandou bem me ajudando",
  });
});
