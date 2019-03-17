module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        cssLoaderOptions: {
          camelCase: false
        }
      }
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: "gatsby-source-seeker",
      options: {
        key: process.env.WWD_SEEKER_KEY
      }
    },
    {
      resolve: "gatsby-source-twitter-profiles",
      options: {
        consumerKey: process.env.WWD_TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.WWD_TWITTER_CONSUMER_KEY,
        bearerToken: process.env.WWD_TWITTER_BEARER_TOKEN
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-99095616-1"
      }
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
          windows: false
        }
      }
    }
  ]
};
