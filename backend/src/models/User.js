import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,

  age: Number,
  gender: String,
  looking_for: String,
  intent: String,
  bio: String,

  is_serious_profile: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("User", UserSchema);
