// Slingshot.GoogleCloud.directiveDefault.GoogleSecretKey = Assets.getText('brachyon-gc.pem');
//
// Slingshot.fileRestrictions("event-banners", {
//   allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
//   maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
// });
//
// Slingshot.createDirective("event-banners", Slingshot.GoogleCloud, {
//   bucket: Meteor.isDevelopment ? "brachyon-test" : "brachyon-prod",
//   GoogleAccessId: Meteor.settings.googleCloud.accessId,
//   authorize: function() {
//     if(!this.userId) {
//       throw new Meteor.Error("Login Required", "You need to log in first.");
//     }
//     return true;
//   },
//   key: function(file) {
//     var ext = file.name.substring(file.name.lastIndexOf("."), file.name.length);
//     return `profile_images/${this.userId}${ext}`;
//   }
// })
