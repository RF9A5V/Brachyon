import { Images } from "/imports/api/event/images.js";

Meteor.methods({
  "events.details.imageSave"(id, bannerId){
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    var bannerUrl = Images.findOne(bannerId);
    Events.update(id, {
      $set: {
        "details.banner": bannerId,
        "details.bannerUrl": bannerUrl.link()
      }
    })
  }
})
