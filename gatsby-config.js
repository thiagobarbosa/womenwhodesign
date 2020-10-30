require("dotenv").config();

module.exports = {
  siteMetadata: {
    title: "Women Who Design",
    description: `Product design, design systems and web development.`,
    siteUrl: `https://womenwho.design`,
  },
  plugins: [
    {
      resolve: "gatsby-source-twitter-profiles",
      options: {
        consumerKey: process.env.WWD_TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.WWD_TWITTER_CONSUMER_KEY,
        bearerToken: process.env.WWD_TWITTER_BEARER_TOKEN,
        twitterIdForFollowingList: "790320422235566080",
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        cssLoaderOptions: {
          camelCase: false,
        },
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.WWD_GOOGLE_ANALYTICS_ID,
      },
    },
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: "./src/favicon.png",
        injectHTML: true,
        icons: {
          android: false,
          appleIcon: false,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: false,
          twitter: false,
          yandex: false,
          windows: false,
        },
      },
    },
  ],
};
