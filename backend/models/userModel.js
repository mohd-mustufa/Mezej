const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    // user_name: {
    //   type: String,
    //   match: /^[a-zA-Z0-9_]+$/,
    //   maxlength: 15,
    //   minlength: 4,
    // },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  { timestamps: true }
);

// Hashing the password before we save it
userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare the hashed password with the entered password
userSchema.methods.matchPassword = async function (enteredPasswd) {
  return await bcrypt.compare(enteredPasswd, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
