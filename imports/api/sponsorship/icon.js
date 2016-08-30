export default Icons = new FS.Collection("icons", {
  stores: [new FS.Store.GridFS("icons", {
    transformWrite(fileObj, read, write) {
      if(fileObj.dimensions){
        var dims = fileObj.dimensions;
        gm(read, fileObj.name()).crop(dims.width, dims.height, dims.left, dims.top).resize('512', '512').stream().pipe(write);
      }
    }
  })],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
})
