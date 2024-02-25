import { model, Schema } from "mongoose";

import Joi from "joi";

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
  },
});

const User = model("User", userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string()
      .valid("starter", "pro", "business")
      .default("starter"),
    token: Joi.string().default(null),
  });
  return schema.validate(user);
};

// const hashPassword = async (password) => {
//   const saltRounds = 10;
//   return await bcrypt.hash(password, saltRounds);
// };

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   try {
//     const hashedPassword = await hashPassword(this.password);
//     this.password = hashedPassword;
//     this.avatarURL = gravatar.url(this.email, { s: "200", d: "retro" });
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

export { User, validateUser };
