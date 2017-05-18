import { Mongo } from 'meteor/mongo';

export default Message = new Mongo.Collection("messages", {});
