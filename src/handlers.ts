import { newDidGood } from "./services/api";
import { getUser, splitMessage, getGIF, replaceEmojis } from "./utils";
import hash from "object-hash";

const hashes = [];

export const onMessage = async (event) => {
  // should stop if there's a subtype eg. thread reply, channel join
  if (event.subtype) {
    throw "Message not valid";
  }

  const sender = getUser(event.user);

  if (!sender) {
    throw "User not found";
  }

  if (event.text) {
    const sender_id = sender.key;
    const { receivers, text } = splitMessage(event.text);

    if (receivers.length === 0) {
      throw "No receiver";
    }

    const description = replaceEmojis(text);
    const photo = await getGIF();

    return Promise.all(
      receivers.map(async (receiver) => {
        const { key: receiver_id } = getUser(receiver);

        const didGood = { sender_id, receiver_id, description };
        const didGoodHash = hash(didGood);

        if (hashes.includes(didGoodHash)) {
          return;
        }

        hashes.push(didGoodHash);

        newDidGood({ ...didGood, photo });
      })
    );
  }
};
