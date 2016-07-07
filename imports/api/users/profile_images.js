export default ProfileImages = new FS.Collection("profile_images", {
  stores: [new FS.Store.GridFS("profile_images", {
    transformWrite: function(fileObj, read, write) {
      var dims = fileObj.dimensions;
      gm(read, fileObj.name()).crop(dims.width, dims.height, dims.left, dims.top).resize('200', '200').stream().pipe(write);
    }
  })],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
})
