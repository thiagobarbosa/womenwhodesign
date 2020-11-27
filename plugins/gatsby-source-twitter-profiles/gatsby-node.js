const crypto = require("crypto");
const _ = require("lodash");
const Twitter = require("twitter");
const addDescriptionLinks = require("./add-description-links");

const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

function includes(description, terms) {
  return terms.some((term) => {
    // The terms should not appear within a word. This means that they must
    // include a space or any other non-letter.
    //
    // For example, we don't want "Oakland" to appear as "la" because Oakland
    // contains "la" within the string. We also want "writer/designer" to
    // register as both writer and designer.
    //
    // We add a space around `${description}` so that the regex captures
    // descriptions that start with the term. The regex alone is not able to
    // handle that.
    const regex = RegExp(`[\\W]${term}[\\W]`, "gi");
    return regex.test(` ${description} `);
  });
}

function getProfileLocation({ location }) {
  return {
    nyc: includes(location, ["nyc", "brooklyn", "new york", "ny", "bronx"]),
    ba: includes(location, [
      "sf",
      "san francisco",
      "bay area",
      "berkeley",
      "palo alto",
      "oakland",
    ]),
    la: includes(location, ["la", "los angeles", "santa monica"]),
    london: includes(location, ["london"]),
    portland: includes(location, ["portland"]),
    toronto: includes(location, ["toronto"]),
    vancouver: includes(location, ["vancouver"]),
    seattle: includes(location, ["seattle"]),
    austin: includes(location, ["austin"]),
  };
}

function getProfilePosition({ description }) {
  return {
    author: includes(description, ["author"]),
    ceo: includes(description, ["ceo"]),
    director:
      includes(description, ["director"]) &&
      !includes(description, ["art director"]) &&
      !includes(description, ["art direction"]) &&
      !includes(description, ["creative director"]),
    founder: includes(description, ["founder"]),
    freelance: includes(description, ["freelance", "freelancer"]),
    head: includes(description, ["head of"]),
    lead: includes(description, ["lead"]),
    manager: includes(description, ["manager"]),
    speaker: includes(description, ["speaker"]),
    vp: includes(description, ["vp"]),
  };
}

function getProfileExpertise({ description }) {
  return {
    art: includes(description, ["art director", "art direction"]),
    content: includes(description, ["content strategy", "content strategist"]),
    creative: includes(description, ["creative director"]),
    systems: includes(description, [
      "design system",
      "design systems",
      "systems designer",
      "systems design",
    ]),
    developer:
      includes(description, ["developer"]) &&
      !includes(description, ["creative developer"]),
    engineer: includes(description, ["engineer", "engineering"]),
    graphic: includes(description, [
      "graphic design",
      "graphic designer",
      "graphic designing",
    ]),
    illustrator: includes(description, [
      "illustrator",
      "illustration",
      "illustrating",
      "illustrations",
    ]),
    letter: includes(description, ["letterer", "lettering"]),
    product: includes(description, ["product design", "product designer"]),
    research: includes(description, ["research", "researcher"]),
    typeface: includes(description, [
      "type design",
      "typeface design",
      "type designer",
      "typeface designer",
    ]),
    ux: includes(description, ["user experience", "ux"]),
    web: includes(description, ["web design", "web designer"]),
    writer: includes(description, ["writer"]),
  };
}

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

  await Promise.all(
    profiles.map(async (profile) => {
      const jsonString = JSON.stringify(profile);

      const gatsbyNode = {
        profile: {
          ...profile,
          description: addDescriptionLinks(profile),
          tags: {
            location: getProfileLocation(profile),
            expertise: getProfileExpertise(profile),
            position: getProfilePosition(profile),
          },
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
