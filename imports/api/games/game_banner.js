import { FilesCollection } from "meteor/ostrio:files";
import fs from "fs";

import Games from "/imports/api/games/games.js";

import { compressThenStore } from "../upload_suite.js";

var GameBanners = new FilesCollection({
  collectionName: "gameBanners",
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
    var location = "gameBanners";

    var self = this;
    var writeStream = fs.createWriteStream(fileRef.path + ".temp");
    gm(fs.createReadStream(fileRef.path), fileRef.name).crop(meta.width, meta.height, meta.left, meta.top).resize("450", "600").stream().pipe(writeStream);
    writeStream.on("close", Meteor.bindEnvironment(function() {
      fs.rename(fileRef.path + ".temp", fileRef.path, Meteor.bindEnvironment(() => {
        if(!Meteor.isDevelopment) {
          compressThenStore(params, fileRef, location, Meteor.bindEnvironment(() => {
            Games.update({_id: meta.gameId}, {
              $set: {
                bannerUrl: "https://brachyontest-604a.kxcdn.com/" + location + "/" + fileRef.name
              }
            })
            self.remove({_id: fileRef._id});
          }));
        }
        else {
          var game = Games.findOne(meta.gameId);
          if(game.banner) {
            self.remove({_id: game.banner});
          }
          Games.update({_id: meta.gameId}, {
            $set: {
              bannerUrl: self.findOne(fileRef._id).link(),
              banner: fileRef._id
            }
          })
        }
      }));
    }));
  }
})

export { GameBanners };
