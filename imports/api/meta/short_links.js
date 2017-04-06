import { Mongo } from 'meteor/mongo';

export default ShortLinks = new Mongo.Collection("shortLinks", {});
