import moment from "moment";

Meteor.methods({
  "user.saveProfileDetails"(bio) {
    const user = Meteor.user();
    if(!user) {
      return;
    }
    Accounts.setUsername(Meteor.userId(), bio.username);
    Meteor.users.update(Meteor.userId(), {
      $set: {
        "profile.bio": bio.description,
        "profile.youtubeEmbed": bio.youtubeEmbed,
        "profile.alias": bio.alias
      }
    });
  },
  "user.updateUsername"(username) {
    const user = Meteor.user();
    if(username == user.username) {
      return;
    }
    if(username.length < 3) {
      throw new Meteor.Error(400, "Username must be at least 3 characters long!");
    }
    if(username.length > 16) {
      throw new Meteor.Error(400, "Username must be less than 17 characters!");
    }
    if(user.profile.usernameLastUpdatedAt) {
      const lastUpdate = moment(user.profile.usernameLastUpdatedAt);
      if(lastUpdate.add(1, "day").isAfter(moment())) {
        throw new Meteor.Error(400, "Can only change username once every 24 hours!");
      }
    }
    Accounts.setUsername(Meteor.userId, username);
    Meteor.users.update(Meteor.userId(), {
      $set: {
        "profile.usernameLastUpdatedAt": new Date()
      }
    })
  },
  "user.updateEmail"(email) {
    const user = Meteor.user();
    const oldEmail = user.emails[0].address;
    if(email == oldEmail) {
      return;
    }
    Accounts.addEmail(Meteor.userId(), email);
    Accounts.removeEmail(Meteor.userId(), oldEmail);
  },
  "user.updatePhoneNumber"(number) {
    if(number.length != 10) {
      throw new Meteor.Error("Issue with phone number. Must be 9 characters.");
    }
    number = "+1" + number;
    Meteor.users.update(Meteor.userId(), {
      $set: {
        "profile.phoneNumber": number,
        "profile.phoneVerified": false
      }
    });
    Meteor.call("user.sendNumberValidation");
  },
  "user.sendNumberValidation"() {
    const user = Meteor.user();
    if(user.profile.phoneNumber && !user.profile.phoneVerified) {
      var verificationCode = parseInt(Math.random() * 10000) + 1000;
      Meteor.users.update(Meteor.userId(), {
        $set: {
          "profile.phoneVerification": verificationCode
        }
      });

      console.log(verificationCode);
    }
  },
  "user.validateNumber"(value) {
    const user = Meteor.user();
    if(user && user.profile.phoneVerification == value) {
      Meteor.users.update(Meteor.userId(), {
        $set: {
          "profile.phoneVerified": true
        },
        $unset: {
          "profile.phoneVerification": 1
        }
      });
    }
    else {
      throw new Meteor.Error(400, "Incorrect verification code.");
    }
  }
})
