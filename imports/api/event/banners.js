import { FilesCollection } from "meteor/ostrio:files";
import fs from "fs";

import { compressThenStore } from "../upload_suite.js";

var Banners = new FilesCollection({
  collectionName: "eventBanners",
  allowClientCode: false,
  onBeforeUpload: function(file) {
    if(file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return "Image can only be less than 10MB.";
    }
  },
  onAfterUpload: function(fileRef) {
    var meta = fileRef.meta;
    var params = {
      file: fileRef.path,
      wait: true,
      lossy: true
    };
    var location = "eventBanners";

    var self = this;
    var writeStream = fs.createWriteStream(fileRef.path + ".temp");
    gm(fs.createReadStream(fileRef.path), fileRef.name).crop(meta.width, meta.height, meta.left, meta.top).resize("1280", "720").stream().pipe(writeStream);
    writeStream.on("close", Meteor.bindEnvironment(function() {
      fs.rename(fileRef.path + ".temp", fileRef.path, Meteor.bindEnvironment(() => {
        if(!Meteor.isDevelopment) {
          compressThenStore(params, fileRef, location, Meteor.bindEnvironment(() => {
            Events.update({
              slug: meta.eventSlug
            }, {
              $set: {
                "details.bannerUrl": "https://brachyontest-604a.kxcdn.com/" + location + "/" + fileRef.name
              }
            });
            self.remove({_id: fileRef._id});
          }));
        }
        else {
          var event = Events.findOne({slug: meta.eventSlug});
          if(event.details.banner) {
            self.remove({_id: event.details.banner});
          }
          Events.update({ slug: meta.eventSlug }, {
            $set: {
              "details.bannerUrl": self.findOne(fileRef._id).link(),
              "details.banner": fileRef._id
            }
          });
        }
      }));
    }));
  }
})

export { Banners };
