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
