import { newDidGood } from "./services/api";
import { getUser, splitMessage } from "./utils";

export const onMessage = (event) => {
  const { key: sender_id } = getUser(event.user);

  if (event.text) {
    const { receiver, description } = splitMessage(event.text);
    const { key: receiver_id } = getUser(receiver);
    newDidGood({ sender_id, receiver_id, description });
  }
};
