import { Document, Model, Schema, model } from "mongoose";

import { toHash } from "../services/password";

export interface UserAttrs {
  email: string;
  password: string;
  brands?: string[];
}

type UserDoc = Document & UserAttrs;

interface UserModel extends Model<UserDoc> {
  createIfNotExists: (user: UserAttrs) => UserDoc;
}

const userSchema: Schema<UserDoc> = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    brands: [{ type: String, required: true }],
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
      versionKey: false,
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = toHash(this.get("password"));
    this.set("password", hashed);
  }

  done();
});

userSchema.statics.createIfNotExists = async (attrs: Partial<UserAttrs>) => {
  let user = await User.findOne({ email: attrs.email });
  if (user) {
    if (attrs.password) {
      user.set("password", attrs.password);
    }
    if (attrs.brands) {
      user.set("brands", attrs.brands);
    }
  } else {
    user = new User(attrs);
  }

  await user.save();

  return user;
};

export const User = model<UserDoc, UserModel>("User", userSchema);
