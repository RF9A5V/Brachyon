import { Mongo } from 'meteor/mongo';

export default MessageQueue = new Mongo.Collection("messageQueues", {});
