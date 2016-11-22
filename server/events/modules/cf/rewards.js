import { RewardIcons } from "/imports/api/sponsorship/reward_icon.js";

Meteor.methods({
  "events.crowdfunding.createReward"(id, name, img, description) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    var image = RewardIcons.findOne(img);
    if(!image) {
      throw new Meteor.Error(404, "Image not found.");
    }
    Events.update(id, {
      $push: {
        "crowdfunding.rewards": {
          name,
          img,
          imgUrl: image.link(),
          description
        }
      }
    })
  },
  "events.crowdfunding.editReward"(id, index, name, img, description) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    var image = RewardIcons.findOne(img);
    if(!image) {
      throw new Meteor.Error(404, "Image not found.");
    }
    Events.update(id, {
      $set: {
        [`crowdfunding.rewards.${index}`]: {
          name,
          img,
          imgUrl: image.link(),
          description
        }
      }
    })
  }
})
