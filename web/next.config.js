module.exports = {
  basePath: "/labelled",
  assetPrefix: "/labelled/",
  webpack: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
