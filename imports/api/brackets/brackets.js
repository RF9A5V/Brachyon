import { Mongo } from 'meteor/mongo';

export default Brackets = new Mongo.Collection('brackets', {});

// import Brackets from "/imports/api/brackets/brackets.js"
// Brackets. (insert/update/delete all serverside only)
// var bracket = Brackets.insert({ field1: 0, field2: str })
// Brackets.find({ _id: id}) (.map and .forEach is how you would iterate through the different objects within the collection)
// brackets.find({ game: gameid})
