import * as redis from "redis";

import { productVariantsQuery } from "./graphql/products";
import { ordersQuery } from "./graphql/orders";

export const client = redis.createClient({
  url: process.env.REDIS_HOST,
});

client.on("error", (err) => console.log("Could not connect to REDIS", err));

const INTERVAL = 5 * 60 * 1000;

export enum Queries {
  products = "labelled:products",
  orders = "labelled:orders",
}

const queries = [
  { key: Queries.products, query: productVariantsQuery },
  { key: Queries.orders, query: ordersQuery },
];

const updateCache = async (key?: string) =>
  Promise.all(
    queries
      .filter((query) => !key || key === query.key)
      .map(async ({ key, query }) =>
        client.set(key, JSON.stringify(await query()))
      )
  );

export const fetchKey = async (key: string): Promise<any> => {
  const cached = await client.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  await updateCache(key);
  return fetchKey(key);
};

setInterval(() => updateCache(), INTERVAL);
