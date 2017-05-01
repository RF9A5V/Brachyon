const connectFB = (cb) => {
  Meteor.linkWithFacebook({
    requestPermissions: ["email", "public_profile", "user_friends", "publish_actions"]
  }, (err) => {
    if(err){
      toastr.error(err.reason, "Error!");
    }
    else {
      toastr.success("Integrated with Facebook!", "Success!");
      cb()
    }
  })
}

const connectTwitter = (cb) => {
  Meteor.linkWithTwitter({
  }, (err) => {
    if(err){
      toastr.error(err.reason, "Error!");
    }
    else {
      toastr.success("Integrated with Twitter!", "Success!");
      cb();
    }
  })
}

export {
  connectFB,
  connectTwitter
}