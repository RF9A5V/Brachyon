import https from "https";
import Kraken from "kraken";
import fs from "fs";

var kraken, gcs, bucket;

if(Meteor.isServer && !Meteor.isDevelopment) {
  import Storage from "@google-cloud/storage";
  kraken = new Kraken({
    "api_key": Meteor.settings.kraken.auth.api_key,
    "api_secret": Meteor.settings.kraken.auth.api_secret
  });
  gcs = Storage({
    projectId: Meteor.settings.googleCloud.projectId,
    credentials: require("../private/gc_key.json")
  })
  var bucketName = Meteor.isDevelopment ? "brachyon-test" : "brachyon-prod";
  bucket = gcs.bucket(bucketName);
}

var compressThenStore = Meteor.bindEnvironment(function(params, fileRef, location, cb) {
  var gcUploadCB = Meteor.bindEnvironment(function(err) {
    if(err) {
      console.log(err);
    }
    else {
      cb();
    }
  })

  var krakenDLCB = Meteor.bindEnvironment(function(response) {
    var file = fs.createWriteStream(fileRef.path);
    response.pipe(file);
    file.on("finish", Meteor.bindEnvironment(function() {
      file.close();
      bucket.upload(fileRef.path, {
        destination: `${location}/${fileRef.name}`,
        public: true
      }, gcUploadCB);
    }))
  })

  var krakenCB = Meteor.bindEnvironment(function(status) {
    if(status.success) {
      var request = https.get(status.kraked_url, krakenDLCB);
    }
    else {
      console.log(`Failed with error: ${status.message}`);
    }
  })

  kraken.upload(params, krakenCB);

})

export { compressThenStore };
