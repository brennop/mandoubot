import axios from "axios";
import users from "./users.json";
import emojis from "./assets/emojis.json";

export const getUser = (user: string): { key: number; name: string } => {
  return users[user];
};

export const splitMessage = (message: string) => {
  const matches = message.split(/<@(.*?)>/g);
  const text = matches
    .slice(2)
    .map((slice) => {
      const user = getUser(slice);
      if (user) {
        return user.name;
      }
      return slice;
    })
    .join("")
    .trim();
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
