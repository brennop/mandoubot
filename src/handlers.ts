import { newDidGood } from "./services/api";
import { getUser, splitMessage, getGIF } from "./utils";

export const onMessage = async (event) => {
  // should stop if there's a subtype eg. thread reply, channel join
  if (event.subtype && event.subtype !== "file_share") {
    return;
  }

  const { key: sender_id } = getUser(event.user);

  if (event.text) {
    const { receiver, description } = splitMessage(event.text);
    const { key: receiver_id } = getUser(receiver);
    newDidGood({ sender_id, receiver_id, description });
  }
};
