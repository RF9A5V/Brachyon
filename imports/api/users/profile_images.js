import { FilesCollection } from "meteor/ostrio:files";
import fs from "fs";
import https from "https";
import Kraken from "kraken";

var kraken, gcs, bucket;

if(Meteor.isServer) {
  import Storage from "@google-cloud/storage";
  kraken = new Kraken({
    "api_key": Meteor.settings.kraken.auth.api_key,
    "api_secret": Meteor.settings.kraken.auth.api_secret
  });
  gcs = Storage({
    projectId: Meteor.settings.googleCloud.projectId,
    keyFilename: Meteor.absolutePath + "/private/gc_key.json"
  })
  var bucketName = Meteor.isDevelopment ? "brachyon-test" : "brachyon-prod";
  bucket = gcs.bucket(bucketName);
}

var ProfileImages = new FilesCollection({
  collectionName: "profileImages",
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
      resize: {
        width: parseInt(meta.width),
        height: parseInt(meta.height),
        x: parseInt(meta.left),
        y: parseInt(meta.top),
        scale: parseInt(640 / meta.width * 100),
        strategy: "crop",
        lossy: true
      }
    };
    var ext = "";
    if(fileRef.type == "image/jpeg" || fileRef.type == "image/jpg") {
      ext = ".jpg";
    }
    else {
      ext = ".png";
    }
    var self = this;

    var gcUploadCB = function(err) {
      if(err) {
        console.log(err);
      }
      else {
        Meteor.users.update({
          _id: fileRef.meta.userId
        }, {
          $set: {
            "profile.imageUrl": (Meteor.isDevelopment ? "https://brachyontest-604a.kxcdn.com/" : "") + "profileImages/" + fileRef.meta.userId + ext
          }
        });
        self.remove({_id: fileRef._id});
      }
    }

    var krakenDLCB = function(response) {
      var file = fs.createWriteStream(fileRef.path);
      response.pipe(file);
      file.on("finish", Meteor.bindEnvironment(function() {
        file.close();
        bucket.upload(fileRef.path, {
          destination: "profileImages/" + fileRef.meta.userId + ext,
          public: true
        }, Meteor.bindEnvironment(gcUploadCB));
      }))
    }

    var krakenCB = function(status) {
      if(status.success) {
        var request = https.get(status.kraked_url, Meteor.bindEnvironment(krakenDLCB));
      }
      else {
        console.log(`Failed with error: ${status.message}`);
      }
    }

    kraken.upload(params, Meteor.bindEnvironment(krakenCB));
  }
})

export { ProfileImages };
