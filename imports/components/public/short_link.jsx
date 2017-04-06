import React, { Component } from "react";
import { browserHistory } from "react-router";

import Loading from "/imports/components/public/loading.jsx";

export default class ShortLinkScreen extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Meteor.call("getLongUrl", props.params.id, (err, data) => {
      if(err) {
        toastr.error("Error grabbing short URL.");
        browserHistory.push("/");
      }
      else {
        browserHistory.push(data);
      }
    });
  }

  render() {
    return (
      <div className="col center x-center">
        <Loading />
      </div>
    );
  }
}
