Meteor.methods({
  "events.organize.create"(id, subModule) {
    if(subModule == "main") {
      Events.update(id, {
        $set: {
          "organize": {
            staff: [],
            schedule: []
          }
        }
      });
    }
    else if(subModule == "staff") {
      Events.update(id, {
        $set: {
          "organize.staff": []
        }
      })
    }
    else if(subModule == "schedule") {
      Events.update(id, {
        $set: {
          "organize.schedule": []
        }
      });
    }
    else {
      throw new Meteor.Error(403, "Submodule " + subModule + " can't exist for Organize module.");
    }
  },
  "events.organize.delete"(id, subModule) {
    if(subModule == "main"){
      Events.update(id, {
        $unset: {
          organize: ""
        }
      });
    }
    else {
      Events.update(id, {
        $unset: {
          [`organize.${subModule}`]: ""
        }
      });
    }
  }
})
