import axios from "axios";
import https from "https";

export default ({ req }) => {
  const baseURL = "https://mark.onthewifi.com/labelled";

  if (typeof window === "undefined") {
    return axios.create({
      baseURL,
      headers: req.headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });
  }

  return axios.create({ baseURL: "/labelled" });
};
