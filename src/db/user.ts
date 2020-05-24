import mongoose from "./index";

export interface IUser extends mongoose.Document {
  name: string;
  slack_id: string;
  key: string;
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  slack_id: {
    type: String,
    require: true,
  },
  key: {
    type: String,
    require: true,
  },
});

const User = new mongoose.model("User", UserSchema);

export default User;
