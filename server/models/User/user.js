const {model, Schema} = require("../db");
const bcrypt = require("bcryptjs");

const {ObjectId} = Schema.Types;
const UserSchema = new Schema(
  {
    isActive: {
      type: Boolean,
      default: true
    },
    firstName: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "can't be blank"]
    },
    lastName: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "can't be blank"]
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      index: true
    },
    emailConfirmed: {
      type: Boolean,
      default: false
    },
    password: {type: String, set: toHashPassword},
    passwordResetToken: String,
    passwordResetExpires: Date,
    role: {
      type: String,
      enum: [
        "admin",
        "developer",
        "productManager",
        "contractor",
        "client",
        "designer",
        "customerSupport"
      ],
      default: "client",
      required: true
    },

    createrUser: {type: ObjectId, required: false, ref: "User"},
    company: {type: ObjectId, required: false, ref: "Company"}
  },
  {timestamps: {createdAt: "createdAt", updatedAt: "updatedAt"}}
);

function toHashPassword(password) {
  if (password) {
    return bcrypt.hashSync(password, (saltOrRounds = 10));
  }
}

UserSchema.plugin(require("mongoose-autopopulate"));

UserSchema.plugin(require("mongoose-unique-validator"), {
  message: "is already taken."
});

const User = model("User", UserSchema);

module.exports = {User, UserSchema};
