import { Schema } from "mongoose";
import { model } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  email_verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  verification_token: {
    type: Number,
    required: true,
  },
  verification_token_time: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: new Date(),
  },
  updated_at: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

export default model("users", userSchema);
