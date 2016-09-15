Meteor.methods({
  "events.revenue.strategy.createSkillTree"(id) {
    var event = Events.findOne(id);
    if(!event){
      throw new Meteor.error(404, "Couldn't find this event!");
    }
    Events.update(id, {
      $set: {
        "revenue.strategy": {
          name: "skill_tree",
          goals: []
        }
      }
    })
  }
});
