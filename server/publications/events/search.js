import Games from '/imports/api/games/games.js';

Meteor.publish("searchEvents", (params) => {
  var query = Meteor.call("events.search", params);
  var events = Events.find(query);

  var gameSet = new Set();
  var ownerIDs = new Set();
  var imgIDs = [];

  events.forEach((e) => {
    if(e.organize != null){
      e.organize.forEach((brack) => {
        gameSet.add(brack.game);
      })
    }
    if(e.details.banner != null){
      imgIDs.push(e.details.banner);
    }
    ownerIDs.add(e.owner);
  });
  var games = Games.find({_id: { $in: Array.from(gameSet) }});
  games.forEach((game) => {
    imgIDs.push(game.banner);
  });
  var imgs = Images.find({ _id: { $in: imgIDs } });
  return [
    events,
    games,
    imgs,
    Meteor.users.find({_id: { $in: Array.from(ownerIDs) }})
  ];
})
