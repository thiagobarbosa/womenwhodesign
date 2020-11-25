const crypto = require("crypto");
const _ = require("lodash");
const Twitter = require("twitter");
const getProfileTags = require("./get-profile-tags");
const addDescriptionLinks = require("./add-description-links");

const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

exports.sourceNodes = async (
  { actions, createNodeId, store, cache },
  { bearerToken, consumerKey, consumerSecret, twitterIdForFollowingList }
) => {
  if (!bearerToken) {
    throw new Error(
      "You must provide a `bearerToken` to `gatsby-source-twitter-profiles`."
    );
  }

  const { createNode } = actions;

  const client = new Twitter({
    consumer_key: consumerKey,
    consumer_secret: consumerSecret,
    bearer_token: bearerToken,
  });

  const counter = 0;
  const followingList = await client.get("friends/ids", {
    user_id: twitterIdForFollowingList,
    stringify_ids: true,
  });

  const chunkedDesigners = await Promise.all(
    _.chunk(followingList.ids, 100).map(async (chunk) => {
      const results = await client.get("users/lookup", {
        user_id: chunk.join(","),
      });

      return results;
    })
  );

  const profiles = _.flatten(chunkedDesigners);

  const profileNodes = await Promise.all(
    profiles.map(async (profile) => {
      delete profile.id;
      const jsonString = JSON.stringify(profile);

      const gatsbyNode = {
        profile: {
          ...profile,
          tags: getProfileTags(profile),
          description: addDescriptionLinks(profile),
        },
        id: createNodeId(`Twitter Profile: ${profile.id_str}`),
        parent: "__SOURCE__",
        children: [],
        internal: {
          type: "TwitterProfile",
          contentDigest: crypto
            .createHash("md5")
            .update(jsonString)
            .digest("hex"),
        },
      };

      const fileNode = await createRemoteFileNode({
        url: profile.profile_image_url_https.replace("_normal", "_400x400"),
        store,
        cache,
        createNode,
        createNodeId,
      });

      if (fileNode) {
        gatsbyNode.localFile___NODE = fileNode.id;
      }

      createNode(gatsbyNode);
    })
  );
};
