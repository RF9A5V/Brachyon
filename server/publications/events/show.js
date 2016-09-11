import Games from '/imports/api/games/games.js';

Meteor.publish('event', (_id) => {
  var event = Events.findOne(_id);
  var sponsors = [];
  if(event.revenue && event.revenue.crowdfunding.sponsors){
    sponsors = event.revenue.crowdfunding.sponsors.map((sponsor) => {
      return sponsor.id;
    })
  }
  var users = Meteor.users.find({_id: {$in: sponsors}}); // later join with participants.
  var profileImages = ProfileImages.find({_id: { $in: (users.map( (user) => { return user.profile.image } )) }});
  var gameIds = [];
  var banners = [event.details.banner];
  var iconIDs = [];
  if(event.brackets) {
    event.brackets.forEach((bracket) => {
      gameIds.push(bracket.game);
    })
  }
  var games = Games.find({_id: { $in: gameIds }});
  banners = banners.concat(games.map((game) => { return game.banner }));
  if(event.revenue != null && event.revenue.stretchGoals != null) {
    iconIDs = event.revenue.stretchGoals.map((key) => {
      if(key == null) {
        return null;
      }
      return key.icon;
    });
  }
  return [
    Events.find({_id}),
    Images.find({
      _id: {
        $in: banners
      }
    }),
    users,
    profileImages,
    games,
    Icons.find({
      _id: {
        $in: iconIDs
      }
    })
  ];
});
