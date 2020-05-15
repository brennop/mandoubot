export const getUserKey = (user: string) => {
  const users = require("./users.json");
  return users[user];
};

export const stripReceiverFromMessage = (message: string) => {
  const match = message.match(/<@(.*?)>/g)[0];
  const id = match.replace(/<@(.*?)>/g, "$1");
  return id;
};
