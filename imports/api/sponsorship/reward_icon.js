import { FilesCollection } from "meteor/ostrio:files";
import fs from "fs";

import { compressThenStore } from "../upload_suite.js";
import Rewards from "/imports/api/sponsorship/rewards.js";

var RewardIcons = new FilesCollection({
  collectionName: "rewardIcons",
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
    var location = "rewardIcons";

    var self = this;
    var writeStream = fs.createWriteStream(fileRef.path + ".temp");
    gm(fs.createReadStream(fileRef.path), fileRef.name).crop(meta.width, meta.height, meta.left, meta.top).resize("480", "480").stream().pipe(writeStream);
    writeStream.on("close", Meteor.bindEnvironment(function() {
      fs.rename(fileRef.path + ".temp", fileRef.path, Meteor.bindEnvironment(() => {
        if(!Meteor.isDevelopment) {
          compressThenStore(params, fileRef, location, Meteor.bindEnvironment(() => {
            Rewards.update({_id: meta.rewardId}, {
              imgUrl: "https://brachyontest-604a.kxcdn.com/" + location + "/" + fileRef.name
            });
            self.remove({_id: fileRef._id});
          }));
        }
        else {
          var reward = Rewards.findOne(meta.rewardId);
          if(reward.img) {
            self.remove({_id: reward.img});
          }
          Rewards.update({_id: meta.rewardId}, {
            $set: {
              imgUrl: self.findOne(fileRef._id).link(),
              img: fileRef._id
            }
          });
        }
      }));
    }));
  }
})

export { RewardIcons };
