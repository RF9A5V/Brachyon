import React, { Component } from "react";
import { browserHistory } from "react-router";

import Leagues from "/imports/api/leagues/league.js";

import { LeagueBanners } from "/imports/api/leagues/banners.js";

export default class SubmitPanel extends Component {

  constructor(props) {
    super(props);
    var league = Leagues.findOne();
    var img = null;
    if(((props.changelog.league || {}).details || {}).image) {
      img = {};
      img.file = props.changelog.league.details.image.file;
      img.meta = props.changelog.league.details.image.meta;
      props.changelog.league.details.image = null;
    }
    console.log(props.changelog.league);
    Meteor.call("leagues.edit", league.slug, props.changelog, (err, data) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        if(img) {
          img.meta.slug = data;
          var dataSeg = img.file.substring(img.file.indexOf("/"), img.file.indexOf(";")).slice(1);
          console.log(img);
          LeagueBanners.insert({
            file: img.file,
            isBase64: true,
            meta: img.meta,
            fileName: data + "." + dataSeg,
            onUploaded: (err) => {
              if(err) {
                return toastr.error(err.reason, "Error!");
              }
              toastr.success("Successfully edited league!", "Success!");
              browserHistory.push(`/leagues/${data}/edit`);
            }
          })
        }
        else {
          toastr.success("Successfully edited league!", "Success!");
          browserHistory.push(`/leagues/${data}/edit`);
        }
      }
    });
    this.state = {
      success: false
    }
  }

  render() {
    return (
      <div>
        {
          this.state.success ? (
            "Updated League"
          ) : (
            "Loading..."
          )
        }
      </div>
    )
  }
}
