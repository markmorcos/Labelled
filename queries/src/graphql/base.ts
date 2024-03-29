import { client } from "../shopify";

export const base: any = async (
  name: string,
  fields: string,
  query?: string
) => {
  let after = "null";
  let result: any = [];

  let hasMore = true;
  do {
    const operation = `
      query {
      ${name}(first: 250, after: ${after}${
      query ? `, query: "${query}"` : ""
    }) {
          edges {
            node {
              ${fields}
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    `;

    const { data } = await client.request(operation);

    result = result.concat(data[name].edges.map(({ node }: any) => node));

    after = `"${data[name].pageInfo.endCursor}"`;
    hasMore = data[name].pageInfo.hasNextPage;
  } while (hasMore);

  return result;
};
