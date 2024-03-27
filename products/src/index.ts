import { app } from "./app";

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

  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
};

start();
