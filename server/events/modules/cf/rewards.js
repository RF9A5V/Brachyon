import { RewardIcons } from "/imports/api/sponsorship/reward_icon.js";
import Rewards from "/imports/api/sponsorship/rewards.js";

Meteor.methods({
  "events.crowdfunding.createReward"(id, name, img, description, value) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    var image = RewardIcons.findOne(img);
    if(!image) {
      throw new Meteor.Error(404, "Image not found.");
    }
    var reward = Rewards.insert({
      name,
      img,
      imgUrl: image.link(),
      description,
      value
    })
    Events.update(id, {
      $push: {
        "crowdfunding.rewards": reward
      }
    })
  },
  "events.crowdfunding.editReward"(id, name, img, description, value) {
    var reward = Rewards.findOne(id);
    if(!reward) {
      throw new Meteor.Error(404, "Reward not found.");
    }
    var image = RewardIcons.findOne(img);
    if(!image) {
      throw new Meteor.Error(404, "Image not found.");
    }
    Rewards.update(id, {
      $set: {
        name,
        img,
        imgUrl: image.link(),
        description,
        value
      }
    })
  }
})
