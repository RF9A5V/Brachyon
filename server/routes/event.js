import { setFBHeader, setTwitterHeader } from "/imports/decorators/headers.js";
import { formatter } from "/imports/decorators/formatter.js";

Picker.route("/event/:slug", function(params, req, res, next) {
  const event = Events.findOne({
    slug: params.slug
  });
  var userAgent = req.headers["user-agent"];

  var details = {
    name: event.details.name,
    description: event.details.description,
    banner: event.details.bannerUrl,
    path: "/event/" + event.slug,
    parse: true
  };

  if(userAgent.indexOf("facebookexternalhit") >= 0) {
    console.log("is facebook");
    res.setHeader("Content-Type", "text/html");
    res.statusCode = 200;
    return res.end(setFBHeader(details));
  }
  if(userAgent.indexOf("Twitterbot") >= 0) {
    console.log("is twitter")
    res.setHeader("Content-Type", "text/html");
    res.statusCode = 200;
    return res.end(setTwitterHeader(details));
  }
  next();
})

Picker.route("/league/:slug", function(params, req, res, next) {
  const league = Leagues.findOne({
    slug: params.slug
  });
  var userAgent = req.headers["user-agent"];

  var details = {
    name: league.details.name,
    description: league.details.description,
    banner: league.details.bannerUrl,
    path: "/league/" + league.slug,
    parse: true
  };

  if(userAgent.indexOf("facebookexternalhit") >= 0) {
    console.log("is facebook");
    res.setHeader("Content-Type", "text/html");
    res.statusCode = 200;
    return res.end(setFBHeader(details));
  }
  if(userAgent.indexOf("Twitterbot") >= 0) {
    console.log("is twitter")
    res.setHeader("Content-Type", "text/html");
    res.statusCode = 200;
    return res.end(setTwitterHeader(details));
  }
  next();
})

Picker.route("/event/:slug/bracket/:index", function(params, req, res, next) {
  const event = Events.findOne({
    slug: params.slug
  });
  const instance = Instances.findOne({
    _id: event.instances.pop()
  });
  const bracketMeta = instance.brackets[params.index];

  const details = {
    name: event.details.name,
    description: formatter(bracketMeta.format.baseFormat, false),
    banner: event.details.bannerUrl,
    path: "/event/" + event.slug + "/bracket/" + params.index,
    parse: false
  }

  var userAgent = req.headers["user-agent"];
  if(userAgent.indexOf("facebookexternalhit") >= 0) {
    console.log("is facebook");
    res.setHeader("Content-Type", "text/html");
    res.statusCode = 200;
    return res.end(setFBHeader(details));
  }
  if(userAgent.indexOf("Twitterbot") >= 0) {
    console.log("is twitter")
    res.setHeader("Content-Type", "text/html");
    res.statusCode = 200;
    return res.end(setTwitterHeader(details));
  }
  next();
})
