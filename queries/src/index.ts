import { DatabaseConnectionError } from "@labelled/common";

import { app } from "./app";
import * as redis from "./redis";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.SHOPIFY_KEY) {
    throw new Error("SHOPIFY_KEY must be defined");
  }
  if (!process.env.SHOPIFY_STORE) {
    throw new Error("SHOPIFY_STORE must be defined");
  }
  if (!process.env.REDIS_HOST) {
    throw new Error("REDIS_HOST must be defined");
  }

  try {
    await redis.client.connect();
    console.log("Connected to REDIS");
  } catch (error) {
    throw new DatabaseConnectionError();
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
};

start();
