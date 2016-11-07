import { Mongo } from 'meteor/mongo';

var Games = new Mongo.Collection('games', {});

Games.friendlySlugs("name");

export default Games;
