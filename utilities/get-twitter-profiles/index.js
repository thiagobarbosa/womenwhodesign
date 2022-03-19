import Twitter from "twitter";
import { chunk, flatten } from "lodash-es";
import addDescriptionLinks from "./add-description-links";
import getTags from "./get-tags";

let localhostCache;

export default async function getTwitterProfiles(twitterAccountId) {
  let chunkedDesigners;

  // We don't want to fetch from Twitter too often when developing locally
  // becuase of rate limiting. We store the result of the first API requests
  // so that we only do it once during `next dev`.
  if (process.env.NODE_ENV === "development" && localhostCache) {
    chunkedDesigners = localhostCache;
  } else {
    const client = new Twitter({
      consumer_key: process.env.WWD_TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.WWD_TWITTER_CONSUMER_SECRET,
      bearer_token: process.env.WWD_TWITTER_BEARER_TOKEN,
    });

    const followingList = await client.get("friends/ids", {
      user_id: twitterAccountId,
      stringify_ids: true,
    });

    chunkedDesigners = await Promise.all(
      chunk(followingList.ids, 100).map(async (chunk) => {
        const results = await client.get("users/lookup", {
          user_id: chunk.join(","),
        });

        return results;
      })
    );

    if (process.env.NODE_ENV === "development") {
      localhostCache = chunkedDesigners;
    }
  }

  const profiles = flatten(chunkedDesigners);

  return profiles.map((p) => ({
    id: p.id_str,
    name: p.name,
    image: p.profile_image_url_https.replace("_normal", "_400x400"),
    hex: `#${p.profile_link_color}`,
    description: addDescriptionLinks(p),
    tags: getTags(p),
    location: p.location,
    handle: p.screen_name,
    ...(p.entities.url?.urls[0].expanded_url
      ? { expandedUrl: p.entities.url.urls[0].expanded_url }
      : {}),
    ...(p.entities.url?.urls[0].display_url
      ? { displayUrl: p.entities.url.urls[0].display_url }
      : {}),
  }));
}
