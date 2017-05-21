import Twilio from "twilio";

import MessageQueue from "/imports/api/messages/message_queue.js"
import Message from "/imports/api/messages/message.js"

var client;
if(Meteor.isDevelopment) {
  var client = Twilio(Meteor.settings.private.twilio.testAccountSid, Meteor.settings.private.twilio.testAuthToken);
}
else {
  var client = Twilio(Meteor.settings.private.twilio.accountSid, Meteor.settings.private.twilio.authToken);
}

Meteor.methods({
  "messages.notifyAll"(userIds, text) {
    const users = Meteor.users.find({
      _id: {
        $in: userIds
      },
      "profile.phoneNumber": {
        $ne: null
      }
    }, {
      fields: {
        "username": 1,
        "profile.phoneNumber": 1
      }
    });
    const from = Meteor.isDevelopment ? "+15005550006" : "+19492429093";
    users.forEach(u => {
      client.messages.create({
        to: u.profile.phoneNumber,
        from,
        body: text
      }, (err) => {
        if(err) {
          console.log("Failed to send to user: " + u.username);
        }
        else {
          console.log("Successfully sent to user: " + u.username);
        }
      })
    })
  }
})
