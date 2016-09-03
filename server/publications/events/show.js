import Games from '/imports/api/games/games.js';

Meteor.publish('event', (_id) => {
  var event = Events.findOne(_id);
  var users = Meteor.users.find({_id: { $in: event.participants || [] }});
  var profileImages = ProfileImages.find({_id: { $in: (users.fetch().map( (user) => { return user.profile.image } )) }});
  var games = [];
  var banners = [event.details.banner];
  if(event.organize != null) {
    games = event.organize.map((bracket) => { return bracket.game });
    var gameBanners = Games.find({_id: { $in: games }}).fetch().map((game) => { return game.banner });
    banners = banners.concat(gameBanners);
  }
  var iconIDs = [];
  if(event.revenue != null && event.revenue.stretchGoals != null) {
    console.log(event.revenue);
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
    Games.find({
      _id: {
        $in: games
      }
    }),
    Icons.find({
      _id: {
        $in: iconIDs
      }
    })
  ];
});
