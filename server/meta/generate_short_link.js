import ShortLinks from "/imports/api/meta/short_links.js";

Meteor.methods({
  "generateShortLink"(url) {
    const hashIndex = url.indexOf("#");
    if(hashIndex >= 0) {
      url = url.slice(0, hashIndex);
    }
    const sLink = ShortLinks.findOne({
      url
    });
    if(sLink) {
      return sLink._id;
    }
    const counter = (ShortLinks.find().count() % 1671 + 30).toString();
    const randComp = parseInt(Math.random() * 100000).toString();
    const dateComp = ((new Date()).getTime() % 10000).toString();

    const alphabet = "abcdefghijklmnopqrstuvwxyz"
    const charSet = "0123456789" + alphabet + alphabet.toUpperCase();

    var hashNum = parseInt(counter + randComp + dateComp);
    var code = "";

    while(hashNum > 0) {
      var charIndex = hashNum % 56;
      code = code + charSet[charIndex];
      hashNum = parseInt(hashNum / 56);
    }
    const collision = ShortLinks.findOne({
      _id: code
    });
    if(!collision) {
      ShortLinks.insert({
        _id: code,
        url
      });
      return code;
    }
    else {
      return Meteor.call("generateShortLink", url);
    }
  },
  "getLongUrl"(id) {
    const sLink = ShortLinks.findOne({
      _id: id
    });
    if(!sLink) {
      throw new Meteor.Error(404, "Short link not found.");
    }
    return sLink.url;
  }
})
