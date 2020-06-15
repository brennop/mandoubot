import { newDidGood } from "./services/api";
import { getUser, splitMessage, getGIF, replaceEmojis } from "./utils";

export const onMessage = async (event) => {
  // should stop if there's a subtype eg. thread reply, channel join
  if (event.subtype && event.subtype !== "file_share") {
    return;
  }

  const sender = getUser(event.user);

  if (!sender) {
    throw "User not found";
  }

  if (event.text) {
    const sender_id = sender.key;
    const { receiver, text } = splitMessage(event.text);
    const description = replaceEmojis(text);
    const { key: receiver_id } = getUser(receiver);
    const photo = event.files ? event.files[0].url_private : await getGIF();
    return newDidGood({ sender_id, receiver_id, description, photo });
  }
};
