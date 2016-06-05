export default Images = new FS.Collection("images", {
  stores: [new FS.Store.GridFS("images")],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
})
