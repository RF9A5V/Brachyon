import { Mongo } from 'meteor/mongo';
import Games from "../games/games.js";

export default Events = new Mongo.Collection('events', {
  transform: (doc) => {
    var games = [];
    if(doc.details.banner){
      var img = Images.findOne(doc.details.banner);
      if(img != null) {
        doc.bannerUrl = img.url();
      }
    }
    doc.games = Games.find({_id: {$in: games}});
    return doc;
  }
});
