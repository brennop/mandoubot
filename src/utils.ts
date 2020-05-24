import axios from "axios";
import emojis from "./assets/emojis.json";

// Probably a bug with eslint:
// https://github.com/typescript-eslint/typescript-eslint/issues/363
// eslint-disable-next-line
import User, { IUser } from "./db/user";

export const getUser = async (slack_id: string): Promise<IUser> => {
  return User.findOne({ slack_id });
};

export const splitMessage = async (message: string) => {
  const matches = message.split(/<@(.*?)>/g);
  const stripped = matches.slice(2);
  const converted = await Promise.all(
    stripped.map(async (slice) => {
      const user = await getUser(slice);
      if (user) {
        return user.name;
      }
      return slice;
    })
  );
  const text = converted.join("").trim();
  return { text, receiver: matches[1] };
};

export const convertEmoji = (shorthand: string): string => {
  return (
    emojis.find((emoji: { emoji: string; shorthands: string[] }) =>
      emoji.shorthands.includes(shorthand)
    )?.emoji || shorthand
  );
};

export const replaceEmojis = (text: string): string => {
  return text.replace(/:([^ ]*?):/g, convertEmoji);
};

export const getGIF = async () => {
  return axios
    .get("https://api.giphy.com/v1/gifs/random", {
      params: {
        api_key: process.env.GIPHY_API_KEY,
        tag: "well done",
        rating: "G",
      },
    })
    .then((response) => response.data.data.image_url)
    .catch((err) => {
      console.error(err);
      return "https://media.giphy.com/media/oBPOP48aQpIxq/giphy.gif";
    });
};
