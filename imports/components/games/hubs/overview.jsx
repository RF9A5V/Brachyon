import React, { Component } from "react";
import moment from "moment";

import BlockContainer from "/imports/components/events/discover/block_container.jsx";

export default class OverviewPanel extends Component {
  render() {
    return (
      <div>
        <BlockContainer title="Events Today" events={Events.find({
          "details.datetime": {
            $gte: new Date(),
            $lte: moment().endOf("day").toDate()
          },
          "published": {$eq: true}
        }, { limit: 6 })} />
        <BlockContainer title="Events Within 7 Days" events={Events.find({
          "details.datetime": {
            $gte: moment().add(1, "day").startOf("day").toDate(),
            $lte: moment().add(7, "day").endOf("day").toDate()
          },
          "published": {$eq: true}
        }, { limit: 6 })} />
        <BlockContainer title="Events Within 30 Days" events={Events.find({
          "details.datetime": {
            $gte: moment().add(8, "day").startOf("day").toDate(),
            $lte: moment().add(30, "day").endOf("day").toDate()
          },
          "published": {$eq: true}
        }, { limit: 6 })} />
      </div>
    )
  }
}
