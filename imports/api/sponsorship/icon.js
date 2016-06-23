export default Icons = new FS.Collection("icons", {
  stores: [new FS.Store.GridFS("icons")],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
})
