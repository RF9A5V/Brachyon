import { Mongo } from 'meteor/mongo';
import Games from "../games/games.js";

export default Events = new Mongo.Collection('events', {
  transform: (doc) => {
    var brackets = doc.organize;
    var games = [];
    if(brackets != null){
      games = brackets.map((bracket) => {
        return bracket.game;
      })
    }
    if(doc.details.banner){
      doc.bannerUrl = Images.findOne(doc.details.banner).url();
    }
    doc.games = Games.find({_id: {$in: games}});
    return doc;
  }
});
