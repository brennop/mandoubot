export const getUserKey = (user: string) => {
  const users = require("./users.json");
  return users[user];
};

export const splitMessage = (message: string) => {
  const matches = message.split(/<@(.*?)>/g);
  return { receiver: matches[1], description: matches[2].trim() };
};
