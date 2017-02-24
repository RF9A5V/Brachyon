import React, { Component } from "react";

import ImageForm from "/imports/components/public/img_form.jsx";

export default class LeagueImage extends Component {

  value() {
    return this.refs.img.value();
  }

  render() {
    var league = Leagues.findOne();
    return (
      <div>
        <h4>League Image</h4>
        <div className="submodule-bg">
          <ImageForm
            url={league.details.bannerUrl}
            aspectRatio={16/9}
            ref="img"
          />
        </div>
      </div>
    )
  }
}
