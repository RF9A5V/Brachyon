import { Mongo } from 'meteor/mongo';

Leagues = new Mongo.Collection("leagues");

Leagues.friendlySlugs("details.name");

export default Leagues;
