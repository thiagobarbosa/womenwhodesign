const Autolinker = require("autolinker");

module.exports = profile => {
  // change t.co strings in  to descriptive urls in descriptions
  let {description} = profile;
  const descriptionUrls = profile.entities.description.urls;
  if (descriptionUrls.length === undefined) {
  } else {
    for (let i = 0; i < descriptionUrls.length; ++i) {
      description = description.replace(
        descriptionUrls[i].url,
        `<a href="${descriptionUrls[i].url}" target="blank" >${
          descriptionUrls[i].display_url
        }</a>`
      );
    }
  }

  // link handles, hashtags and email addresses in descriptions
  description = Autolinker.link(description, {
    mention: "twitter",
    hashtag: "twitter",
    replaceFn(match) {
      switch (match.getType()) {
        case "url":
          var tag = match.buildTag();
          return tag;
        case "mention":
          var mention = match.getMention();
          return `<a href="https://twitter.com/${mention}" target="blank" >@${mention}</a>`;
        case "email":
          var email = match.getEmail();
          return `<a href="mailto:"${email}" target="blank" >${email}</a>`;
        case "hashtag":
          var hashtag = match.getHashtag();
          return `<a href="https://twitter.com/hashtag/${hashtag}" target="blank" >#${hashtag}</a>`;
      }
    }
  });
  return description;
};
