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
  "messages.create"(text) {
    console.log(text);
    const to = Meteor.isDevelopment ? "+14108675309" : "+19496789288";
    const from = Meteor.isDevelopment ? "+15005550006" : "+19492429093";
    client.messages.create({
      to,
      from,
      body: text
    }, (err, message) => {
      console.log(err);
      console.log(message);
    })
  }
})
