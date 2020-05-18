import axios from "axios";

export const getUser = (user: string): { key: number; name: string } => {
  const users = require("./users.json");
  return users[user];
};

export const splitMessage = (message: string) => {
  const matches = message.split(/<@(.*?)>/g);
  const description = matches
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
  return { description, receiver: matches[1] };
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
