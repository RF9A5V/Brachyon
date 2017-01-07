import { Mongo } from 'meteor/mongo';

Leagues = new Mongo.Collection("leagues");

Leagues.friendlySlugs({
  slugFrom: ["details.name", "details.season"],
  slugGenerator: (base, index) => {
    return base + "." + index;
  }
});

export default Leagues;
