import { newDidGood } from "./services/api";
import { getUser, splitMessage, getGIF, replaceEmojis } from "./utils";

export const onMessage = async (event) => {
  // should stop if there's a subtype eg. thread reply, channel join
  if (event.subtype) {
    throw "Message not valid"
  }

  const sender = getUser(event.user);

  if (!sender) {
    throw "User not found";
  }

  if (event.text) {
    const sender_id = sender.key;
    const { receiver, text } = splitMessage(event.text);
    if (!receiver) {
      throw "No receiver";
    }
    const description = replaceEmojis(text);
    const { key: receiver_id } = getUser(receiver);
    const photo = await getGIF();
    return newDidGood({ sender_id, receiver_id, description, photo });
  }
};
