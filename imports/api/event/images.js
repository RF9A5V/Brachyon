export default Images = new FS.Collection("images", {
  stores: [new FS.Store.GridFS("images", {
    transformWrite(fileObj, read, write) {
      if(fileObj.dimensions){
        var dims = fileObj.dimensions;
        gm(read, fileObj.name()).crop(dims.width, dims.height, dims.left, dims.top).resize('1024', '576').stream().pipe(write);
      }
    }
  })],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
})
