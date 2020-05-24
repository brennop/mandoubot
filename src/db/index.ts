import mongoose from "mongoose";

mongoose.connect("mongodb://172.17.0.2:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default mongoose;
