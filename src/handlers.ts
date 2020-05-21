import { newDidGood } from "./services/api";
import { getUser, splitMessage, getGIF, replaceEmojis } from "./utils";

export const onMessage = async (event) => {
  // should stop if there's a subtype eg. thread reply, channel join
  if (event.subtype && event.subtype !== "file_share") {
    return;
  }

  const { key: sender_id } = getUser(event.user);

  if (event.text) {
    const { receiver, text } = splitMessage(event.text);
    const description = replaceEmojis(text);
    const { key: receiver_id } = getUser(receiver);
    const photo = event.files ? event.files[0].url_private : await getGIF();
    newDidGood({ sender_id, receiver_id, description, photo });
  }
};
