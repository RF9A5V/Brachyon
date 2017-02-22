import Leagues from "/imports/api/leagues/league.js";
import Instances from "/imports/api/event/instance.js"
import { flatten } from "flat";

Meteor.methods({
  "leagues.edit"(id, attrs) {
    var league = Leagues.findOne(id);
    Leagues.update(id, {
      $set: flatten(attrs)
    });
  }
})
