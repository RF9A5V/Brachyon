export default ProfileBanners = new FS.Collection("profile_banners", {
  stores: [new FS.Store.GridFS("profile_banners", {
    transformWrite: function(fileObj, read, write) {
      var dims = fileObj.dimensions;
      gm(read, fileObj.name()).crop(dims.width, dims.height, dims.left, dims.top).resize("1280", "360").stream().pipe(write);
    }
  })],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
})
