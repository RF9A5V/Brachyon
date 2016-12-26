import React, { Component } from "react";
import RoundRobinDisplay from "/imports/components/tournaments/roundrobin/display.jsx";

export default class TiebreakerSlide extends Component {

  backgroundImage(useDarkerOverlay){
    var imgUrl = this.props.event.details.bannerUrl ? this.props.event.details.bannerUrl : "/images/bg.jpg";
    if(useDarkerOverlay){
      return `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${imgUrl})`;
    }
    return `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.85)), url(${imgUrl})`;
  }

  render() {
    return (
      <div className="col-1 row slide" style={{backgroundImage: this.backgroundImage(false)}}>
        <div className="col-1" style={{padding: 20}}>
          <RoundRobinDisplay rounds={Brackets.findOne().rounds} />
        </div>
      </div>
    )
  }
}
