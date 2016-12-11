import { RewardIcons } from "/imports/api/sponsorship/reward_icon.js";
import Rewards from "/imports/api/sponsorship/rewards.js";

Meteor.methods({
  "events.crowdfunding.createReward"(id, name, description, value) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    var reward = Rewards.insert({
      name,
      description,
      value
    });
    Events.update(id, {
      $push: {
        "crowdfunding.rewards": reward
      }
    });
    return reward;
  },
  "events.crowdfunding.editReward"(id, name, description, value) {
    var reward = Rewards.findOne(id);
    if(!reward) {
      throw new Meteor.Error(404, "Reward not found.");
    }
    Rewards.update(id, {
      $set: {
        name,
        description,
        value
      }
    })
  }
})
