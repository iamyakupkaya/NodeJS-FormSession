// model bizim verilerimizi database e kaydetmeye ve oradan verilerimizi almaya çalıştığımızda
//...yapacağımız işlemlerin yeridir.

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    surname: {
      type: String,
      trim: true,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { collection: "users", timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
