import React, { Component } from "react";

export default class StatsSection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          id: "t69Lq9p5Qy5h9wpTH",
          wins: 2,
          losses: 1,
          placement: 0
        },
        {
          id: "k3ZpMAPWm3yES95ku",
          wins: 2,
          losses: 1,
          placement: 1
        },
        {
          id: "5v8mGr5H56wSrceuk",
          wins: 2,
          losses: 1,
          placement: 2
        },
        {
          id: "2yWN8Z35TKP7ybKmX",
          wins: 2,
          losses: 1,
          placement: 3
        }
      ]
    }
  }

  imgOrDefault(event) {
    if(event.bannerUrl != null){
      return event.bannerUrl;
    }
    var games = event.games.fetch();
    for(var i in games) {
      if(games[i].bannerUrl != null){
        return games[i].bannerUrl;
      }
    }
    return "/images/bg.jpg";
  }

  placementFlair(value) {
    if(value == 0) {
      return (
        <span style={{fontWeight: "bold", fontSize: "22px", color: "gold"}}>1st</span>
      )
    }
    else if(value == 1) {
      return (
        <span style={{fontWeight: "bold", fontSize: "20px", color: "silver"}}>2nd</span>
      )
    }
    else if(value == 2) {
      return (
        <span style={{fontWeight: "bold", fontSize: "18px", color: "#CD7F32"}}>3rd</span>
      )
    }
    else {
      var stem = "th";
      value = value + 1;
      if(value % 10 == 1) {
        stem = "st";
      }
      else if(value % 10 == 2) {
        stem = "nd";
      }
      else if(value % 10 == 3) {
        stem = "rd";
      }
      return (
        <span style={{fontSize: "18px"}}>{value}{stem}</span>
      )
    }
  }

  render() {
    return (
      <div className="col" style={{width: "50%", margin: "0 auto"}}>
        <div className="row x-center" style={{padding: 20}}>
          <div className="col-1">
            <h3>Event Name</h3>
          </div>
          <div className="col-2">
            <h3>Placement</h3>
          </div>
          <div className="col-1">
            <h3>Win / Loss</h3>
          </div>
        </div>
        {
          this.state.history.map(history => {
            var event = Events.findOne(history.id);
            return (
              <div className="row x-center" style={{padding: 20, background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${this.imgOrDefault(event)})`, marginBottom: 20}}>
                <div className="col-1 col">
                  { event.details.name }
                </div>
                <div className="col-2 col">
                  { this.placementFlair(history.placement) }
                </div>
                <div className="col-1" style={{alignItems: "flex-start"}}>
                  <span>{ history.wins } / { history.losses }</span>
                </div>
              </div>
            );
          })
        }
      </div>
    )
  }
}
