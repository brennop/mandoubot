export const getUserKey = (user: string) => {
  const users = require("./users.json");
  return users[user];
};
