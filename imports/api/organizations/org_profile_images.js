import { FilesCollection } from "meteor/ostrio:files";
import fs from "fs";

import Organizations from "/imports/api/organizations/organizations.js"

import { compressThenStore } from "../upload_suite.js";

var OrgImages = new FilesCollection({
  collectionName: "orgImages",
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
    var location = "orgImages";

    var self = this;
    var writeStream = fs.createWriteStream(fileRef.path + ".temp");
    gm(fs.createReadStream(fileRef.path), fileRef.name).crop(meta.width, meta.height, meta.left, meta.top).resize("640", "640").stream().pipe(writeStream);
    writeStream.on("close", Meteor.bindEnvironment(function() {
      fs.rename(fileRef.path + ".temp", fileRef.path, Meteor.bindEnvironment(() => {
        if(!Meteor.isDevelopment) {
          compressThenStore(params, fileRef, location, Meteor.bindEnvironment(() => {
            Organizations.update({
              slug: fileRef.meta.orgSlug
            }, {
              $set: {
                "details.profileUrl": "https://brachyontest-604a.kxcdn.com/" + location + "/" + fileRef.name
              }
            });
            self.remove({_id: fileRef._id});
          }));
        }
        else {
          var org = Organizations.findOne({slug: meta.orgSlug});
          if(org.details.profileImage) {
            self.remove({_id: org.details.profileImage});
          }
          Organizations.update({ slug: meta.orgSlug }, {
            $set: {
              "details.profileUrl": self.findOne(fileRef._id).link(),
              "details.profileImage": fileRef._id
            }
          });
        }
      }));
    }));
  }
})

export { OrgImages };
