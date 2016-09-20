import { FilesCollection } from "meteor/ostrio:files";

import Grid from "gridfs-stream";
import { MongoInternals } from "meteor/mongo";
import fs from "fs";

let gfs;
if(Meteor.isServer) {
  gfs = Grid(
    MongoInternals.defaultRemoteCollectionDriver().mongo.db,
    MongoInternals.NpmModule
  );
}

export const Images = new FilesCollection({
  debug: true,
  collectionName: "images",
  allowClientCode: false,
  onBeforeUpload(file) {
    return true;
  },
  onAfterUpload(image) {
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
      gm(fs.createReadStream(image.versions[versionName].path), image.name).crop(dims.width, dims.height, dims.left, dims.top).resize("1280", "720").stream().pipe(writeStream);
      writeStream.on("close", Meteor.bindEnvironment(file => {
        const property = `versions.${versionName}.meta.gridFsFileId`;
        this.collection.update(image._id, {
          $set: {
            [property]: file._id.toString()
          }
        });
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
