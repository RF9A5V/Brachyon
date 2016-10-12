import { FilesCollection } from "meteor/ostrio:files";

import Grid from "gridfs-stream";
import { MongoInternals } from "meteor/mongo";
import fs from "fs";
import Dropbox from "dropbox";
import Request from "request";

let gfs;
var client, bound = {};

if(Meteor.isServer) {
  gfs = Grid(
    MongoInternals.defaultRemoteCollectionDriver().mongo.db,
    MongoInternals.NpmModule
  );
  var init;
  if(Meteor.isDevelopment){
    init = {
      key: Meteor.settings.public.dropbox.key,
      secret: Meteor.settings.private.dropbox.secret,
      token: Meteor.settings.private.dropbox.token
    }
  }
  else {
    init = {
      key: Meteor.settings.public.dropbox.alphaKey,
      secret: Meteor.settings.private.dropbox.alphaSecret,
      token: Meteor.settings.private.dropbox.alphaToken
    }
  }
  client = new Dropbox.Client(init);
  bound = Meteor.bindEnvironment(function(cb) {
    return cb();
  });
}

export const Images = new FilesCollection({
  debug: false,
  collectionName: "images",
  allowClientCode: false,
  onBeforeUpload(file) {
    return true;
  },
  onAfterUpload(image) {

    var makeUrl = function(stat, imgID, version, triesUrl) {
      if (triesUrl == null) {
        triesUrl = 0;
      }
      var self = this;
      client.makeUrl(stat.path, {
        long: true,
        downloadHack: true
      }, function(error, xml) {
        // Store downloadable link in file's meta object
        bound(function() {
          if (error) {
            if (triesUrl < 10) {
              Meteor.setTimeout(function() {
                makeUrl(stat, imgID, version, ++triesUrl);
              }, 2048);
            } else {
              console.error(error, {
                triesUrl: triesUrl
              });
            }
          } else if (xml) {
            var upd = {
              $set: {}
            };
            upd['$set']["versions." + version + ".meta.pipeFrom"] = xml.url;
            upd['$set']["versions." + version + ".meta.pipePath"] = stat.path;
            self.collection.update({
              _id: imgID
            }, upd, function(error) {
              if (error) {
                console.error(error);
              } else {
                // Unlink original files from FS
                // after successful upload to DropBox
                self.unlink(self.collection.findOne(imgID), version);
              }
            });
          } else {
            if (triesUrl < 10) {
              Meteor.setTimeout(function() {
                makeUrl(stat, imgID, version, ++triesUrl);
              }, 2048);
            } else {
              console.error("client.makeUrl doesn't returns xml", {
                triesUrl: triesUrl
              });
            }
          }
        });
      });
    };

    var writeToDB = function(imgID, version, data, ext, triesSend) {
      // DropBox already uses random URLs
      // No need to use random file names
      if (triesSend == null) {
        triesSend = 0;
      }
      client.writeFile(imgID + "-" + version + ext, data, function(error, stat) {
        bound(function() {
          if (error) {
            if (triesSend < 10) {
              Meteor.setTimeout(function() {
                writeToDB(imgID, version, data, ++triesSend);
              }, 2048);
            } else {
              console.error(error, {
                triesSend: triesSend
              });
            }
          } else {
            // Generate downloadable link
            makeUrl(stat, imgID, version);
          }
        });
      });
    };

    var readFile = function(imgID, version, gfsID, ext, triesRead) {
      if (triesRead == null) {
        triesRead = 0;
      }
      const readStream = gfs.createReadStream({ _id: gfsID });
      const tempWriteStream = fs.createWriteStream(imgID);
      readStream.pipe(tempWriteStream);
      tempWriteStream.on("close", () => {
        fs.readFile(imgID, (err, data) => {
          bound(function() {
            if(err) {
              if (triesRead < 10) {
                readFile(imgID, version, gfsID, ext, ++triesRead);
              } else {
                console.error(err);
              }
            }
            else {
              writeToDB(imgID, version, data, ext);
            }
          })
        })
      });
    };

    var sendToStorage = function(imgID, version, gfsID, ext) {
      readFile(imgID, version, gfsID, ext);
    };

    Object.keys(image.versions).forEach(versionName => {
      const metadata = {
        versionName,
        imageId: image._id,
        storedAt: new Date()
      };
      const writeStream = gfs.createWriteStream({
        filename: image.name,
        metadata
      });
      var dims = image.meta;
      var type = "";
      switch(image.type) {
        case "image/png":
          type = ".png";
          break;
        case "image/jpeg":
          type = ".jpg";
          break;
        case "image/jpg":
          type = ".jpg";
          break;
        default:
          type = ".png";
      }
      gm(fs.createReadStream(image.versions[versionName].path), image.name).crop(dims.width, dims.height, dims.left, dims.top).resize("1280", "720").stream().pipe(writeStream);
      writeStream.on("close", Meteor.bindEnvironment(file => {

        const readStream = gfs.createReadStream({ _id: file._id.toString() });
        const overwriteOld = fs.createWriteStream(image.versions[versionName].path);

        readStream.pipe(overwriteOld);

        const property = `versions.${versionName}.meta.gridFsFileId`;
        this.collection.update(image._id, {
          $set: {
            [property]: file._id.toString()
          }
        });
        sendToStorage(image._id, versionName, file._id.toString(), type);
        this.unlink(this.collection.findOne(image._id), versionName);
      }))
    });
  },
  interceptDownload(http, image, versionName) {
    const _id = (image.versions[versionName].meta || {}).gridFsFileId;
    if(_id) {
      const readStream = gfs.createReadStream({ _id });
      readStream.on("error", err => { throw err; });
      readStream.pipe(http.response);
    }
    return Boolean(_id);
  },
  onAfterRemove(images) {
    images.forEach(image => {
      Object.keys(image.versions).forEach(versionName => {
        const _id = (image.versions[versionName].meta || {}).gridFsFileId;
        if(_id) {
          gfs.remove({_id}, err => {
            if(err) {
              throw err;
            }
          })
        }
      })
    })
  }
})
