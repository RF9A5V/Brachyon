import React from "react";
import Banners from "/imports/api/event/banners.js";

export default class EventBlock extends React.Component {

  constructor(props) {
    super(props);
    this.event = Events.findOne();
  }

  imgOrDefault() {
    var url = this.event.bannerUrl;
    if(url == null){
      var games = this.event.games.fetch();
      for(var i in games){
        
        if(games[i].bannerUrl != null){
          return games[i].bannerUrl;
        }
      }
      return "/images/bg.jpg";
    }
    else {
      return url;
    }
  }

  onClick(e) {
    window.scrollTo(0, 0);
    this.props.handler(e);
  }

  render(){
    return (
      <div className="event-block" onClick={this.onClick.bind(this)}>
        <img src={this.imgOrDefault()} />
      </div>
    )
  }
}
