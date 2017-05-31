import { Mongo } from 'meteor/mongo';
import Games from "../games/games.js";
import { Banners } from "/imports/api/event/banners.js";

Events = new Mongo.Collection('events', {
  transform: (doc) => {
    var games = [];
    doc.games = Games.find({_id: {$in: games}});
    return doc;
  }
});

export default Events;
