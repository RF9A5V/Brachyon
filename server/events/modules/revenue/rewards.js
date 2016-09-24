import { ProfileImages } from "/imports/api/users/profile_images.js";

Meteor.methods({
  "events.revenue.rewards.createReward"(id, name, img, description) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    var profileImage = ProfileImages.findOne(img);
    if(!profileImage) {
      throw new Meteor.Error(404, "Image not found.");
    }
    Events.update(id, {
      $push: {
        "revenue.rewards": {
          name,
          img,
          imgUrl: profileImage.link(),
          description
        }
      }
    })
  },
  "events.revenue.rewards.editReward"(id, name, img, description, index) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    var profileImage = ProfileImages.findOne(img);
    if(!profileImage) {
      throw new Meteor.Error(404, "Image not found.");
    }
    Events.update(id, {
      $set: {
        [`revenue.rewards.${index}`]: {
          name,
          img,
          imgUrl: profileImage.link(),
          description
        }
      }
    })
  },
  "events.revenue.rewards.deleteReward"(id, index) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    ProfileImages.remove(event.revenue.rewards[index].img);
    Events.update(id, {
      $unset: {
        [`revenue.rewards.${index}`]: 1
      }
    });
    Events.update(id, {
      $pull: {
        "revenue.rewards": null
      }
    })
  }
})
