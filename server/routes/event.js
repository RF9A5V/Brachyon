import { setHeader } from "/imports/decorators/headers.js";
import { formatter } from "/imports/decorators/formatter.js";

import ShortLinks from "/imports/api/meta/short_links.js";

Picker.route("/event/:slug", function(params, req, res, next) {
  const event = Events.findOne({
    slug: params.slug
  });
  if(!event) {
    return next();
  }
  var details = {
    name: event.details.name,
    description: event.details.description,
    banner: event.details.bannerUrl,
    path: "/event/" + event.slug,
    parse: true
  };
  var userAgent = req.headers["user-agent"];
  if(userAgent.indexOf("facebookexternalhit") >= 0 || userAgent.indexOf("Twitterbot") >= 0) {
    res.setHeader("Content-Type", "text/html");
    res.statusCode = 200;
    return res.end(setHeader(details));
  }
  next();
})

Picker.route("/event/:slug/:whatevs", function(params, req, res, next) {
  const event = Events.findOne({
    slug: params.slug
  });
  if(!event) {
    return next();
  }
  var details = {
    name: event.details.name,
    description: event.details.description,
    banner: event.details.bannerUrl,
    path: "/event/" + event.slug,
    parse: true
  };
  var userAgent = req.headers["user-agent"];
  if(userAgent.indexOf("facebookexternalhit") >= 0 || userAgent.indexOf("Twitterbot") >= 0) {
    res.setHeader("Content-Type", "text/html");
    res.statusCode = 200;
    return res.end(setHeader(details));
  }
  next();
})

Picker.route("/league/:slug", function(params, req, res, next) {
  const league = Leagues.findOne({
    slug: params.slug
  });
  if(!league) {
    return next();
  }
  var details = {
    name: league.details.name,
    description: league.details.description,
    banner: league.details.bannerUrl,
    path: "/league/" + league.slug,
    parse: true
  };
  var userAgent = req.headers["user-agent"];
  if(userAgent.indexOf("facebookexternalhit") >= 0 || userAgent.indexOf("Twitterbot") >= 0) {
    res.setHeader("Content-Type", "text/html");
    res.statusCode = 200;
    return res.end(setHeader(details));
  }
  next();
})

Picker.route("/event/:slug/bracket/:index", function(params, req, res, next) {
  const event = Events.findOne({
    slug: params.slug
  });
  if(!event) {
    return next();
  }
  const instance = Instances.findOne({
    _id: event.instances.pop()
  });
  const bracketMeta = instance.brackets[parseInt(params.index)];
  const details = {
    name: event.details.name,
    description: event.details.description,
    banner: event.details.bannerUrl,
    path: "/event/" + event.slug + "/bracket/" + params.index,
    parse: true
  }
  var userAgent = req.headers["user-agent"];
  if(userAgent.indexOf("facebookexternalhit") >= 0 || userAgent.indexOf("Twitterbot") >= 0) {
    res.setHeader("Content-Type", "text/html");
    res.statusCode = 200;
    return res.end(setHeader(details));
  }
  next();
})

Picker.route("/_:sLink", (params, req, res, next) => {
  const path = Meteor.call("getLongUrl", params.sLink);
  res.writeHead(301, {
    Location: path
  });
  res.end();
})
