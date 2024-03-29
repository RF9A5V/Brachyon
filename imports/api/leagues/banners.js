import { FilesCollection } from "meteor/ostrio:files";
import fs from "fs";

import Leagues from "./league.js";
import { compressThenStore } from "../upload_suite.js";

var LeagueBanners = new FilesCollection({
  collectionName: "leagueBanners",
  allowClientCode: false,
  onBeforeUpload: function(file) {
    if(file.size <= 10485760 && /png|jpg|jpeg/i.test(file.type)) {
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
    var location = "leagueBanners";
    var self = this;
    var writeStream = fs.createWriteStream(fileRef.path + ".temp");
    gm(fs.createReadStream(fileRef.path), fileRef.name).crop(meta.width, meta.height, meta.left, meta.top).resize("1280", "720").stream().pipe(writeStream);
    writeStream.on("close", Meteor.bindEnvironment(function() {
      fs.rename(fileRef.path + ".temp", fileRef.path, Meteor.bindEnvironment(() => {
        if(!Meteor.isDevelopment) {
          compressThenStore(params, fileRef, location, Meteor.bindEnvironment(() => {
            var league = Leagues.findOne({ slug: meta.slug });
            Leagues.update({
              slug: meta.slug
            }, {
              $set: {
                "details.bannerUrl": "https://brachyontest-604a.kxcdn.com/" + location + "/" + fileRef.name
              }
            });
            Events.update({ league: league._id }, {
              $set: {
                "details.bannerUrl": "https://brachyontest-604a.kxcdn.com/" + location + "/" + fileRef.name
              }
            }, { multi: true });
            self.remove({_id: fileRef._id});
          }));
        }
        else {
          var league = Leagues.findOne({slug: meta.slug});

          var link = self.findOne(fileRef._id).link();
          Leagues.update({ slug: meta.slug }, {
            $set: {
              "details.bannerUrl": link,
              "details.banner": fileRef._id
            }
          });
          Events.update({ league: league._id }, {
            $set: {
              "details.bannerUrl": link
            }
          }, { multi: true });
          if(league.details.banner) {
            self.remove({_id: league.details.banner});
          }
        }
      }));
    }));
  }
})

export { LeagueBanners };
