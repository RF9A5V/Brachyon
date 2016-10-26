import { Mongo } from 'meteor/mongo';
import Games from "../games/games.js";
import { Images } from "/imports/api/event/images.js";

Events = new Mongo.Collection('events', {
  transform: (doc) => {
    var games = [];
    doc.games = Games.find({_id: {$in: games}});
    return doc;
  }
});

Events.friendlySlugs("details.name");

export default Events;
