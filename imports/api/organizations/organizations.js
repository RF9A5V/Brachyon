import { Mongo } from 'meteor/mongo';

Organizations = new Mongo.Collection('organizations', {});

Organizations.friendlySlugs("name");

export default Organizations
