import { FilesCollection } from "meteor/ostrio:files";
import fs from "fs";

import { compressThenStore } from "../upload_suite.js";

var ProfileImages = new FilesCollection({
  collectionName: "profileImages",
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
    var location = "profileImages";

    var self = this;
    var writeStream = fs.createWriteStream(fileRef.path + ".temp");
    gm(fs.createReadStream(fileRef.path), fileRef.name).crop(meta.width, meta.height, meta.left, meta.top).resize("640", "640").stream().pipe(writeStream);
    writeStream.on("close", Meteor.bindEnvironment(function() {
      fs.rename(fileRef.path + ".temp", fileRef.path, Meteor.bindEnvironment(() => {
        if(!Meteor.isDevelopment) {
          compressThenStore(params, fileRef, location, Meteor.bindEnvironment(() => {
            Meteor.users.update({
              _id: fileRef.meta.userId
            }, {
              $set: {
                "profile.imageUrl": "https://brachyontest-604a.kxcdn.com/" + location + "/" + fileRef.name
              }
            });
            self.remove({_id: fileRef._id});
          }));
        }
        else {
          var user = Meteor.users.findOne(meta.userId);
          if(user.profile.image) {
            self.remove({_id: user.profile.image});
          }
          Meteor.users.update({ _id: meta.userId }, {
            $set: {
              "profile.imageUrl": self.findOne(fileRef._id).link(),
              "profile.image": fileRef._id
            }
          });
        }
      }));
    }));
  }
})

export { ProfileImages };
