import React, { Component } from "react";

import MessageQueues from "/imports/api/messages/message_queue.js";
import Messages from "/imports/api/messages/message.js";

export default class MessageScreen extends Component {

  sendMessage() {
    Meteor.call("messages.create", "Hello!", (err, data) => {

    })
  }

  render() {
    return (
      <div>
        <button onClick={this.sendMessage.bind(this)}>Message Me</button>
      </div>
    )
  }
}
