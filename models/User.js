import mongoose from "mongoose";

//Defining Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  contactno: { type: Number, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  tc: { type: Boolean, required: true, trim: true },
});

//Model

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
