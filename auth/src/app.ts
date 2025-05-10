import "express-async-errors";
import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError } from "@labelled/common";

import { currentUserRouter } from "./routes/auth/current-user";
import { signInRouter } from "./routes/auth/sign-in";
import { signOutRouter } from "./routes/auth/sign-out";
import { signUpRouter } from "./routes/auth/sign-up";

import { indexAuthRouter } from "./routes/users";
import { createAuthRouter } from "./routes/users/create";
import { patchAuthRouter } from "./routes/users/update";
import { readAuthRouter } from "./routes/users/read";
import { deleteAuthRouter } from "./routes/users/delete";

export const app = express();

app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: ["production"].includes(process.env.ENVIRONMENT!),
  })
);

app.use("/labelled", currentUserRouter);
app.use("/labelled", signInRouter);
app.use("/labelled", signOutRouter);
app.use("/labelled", signUpRouter);

app.use("/labelled", createAuthRouter);
app.use("/labelled", readAuthRouter);
app.use("/labelled", indexAuthRouter);
app.use("/labelled", patchAuthRouter);
app.use("/labelled", deleteAuthRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);
