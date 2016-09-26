import React, { Component } from "react";

export default class RevenuePanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: "Rewards",
      desc: "Bacon ipsum dolor amet pastrami porchetta filet mignon, andouille flank ham hock jerky ribeye short ribs venison ham pig biltong beef t-bone.\n Corned beef cupim jowl kielbasa. Pastrami jowl capicola turkey ham hock chuck. Biltong meatloaf shankle strip steak capicola cow shank doner t-bone landjaeger kevin ball tip beef ribs jowl. Flank shank corned beef, chuck andouille ham hock spare ribs cupim cow rump."
    }
  }

  value() {
    return {};
  }

  onInfoClick(value) {
    return (e) => {
      if(e.target.classList.contains("active")) {
        return;
      }
      var desc = [
        {
          name: "Rewards",
          desc: "Bacon ipsum dolor amet pastrami porchetta filet mignon, andouille flank ham hock jerky ribeye short ribs venison ham pig biltong beef t-bone.\n Corned beef cupim jowl kielbasa. Pastrami jowl capicola turkey ham hock chuck. Biltong meatloaf shankle strip steak capicola cow shank doner t-bone landjaeger kevin ball tip beef ribs jowl. Flank shank corned beef, chuck andouille ham hock spare ribs cupim cow rump."
        },
        {
          name: "Tiers",
          desc: "Bacon ipsum dolor amet pastrami porchetta filet mignon, andouille flank ham hock jerky ribeye short ribs venison ham pig biltong beef t-bone. Corned beef cupim jowl kielbasa.\n Pastrami jowl capicola turkey ham hock chuck. Biltong meatloaf shankle strip steak capicola cow shank doner t-bone landjaeger kevin ball tip beef ribs jowl. Flank shank corned beef, chuck andouille ham hock spare ribs cupim cow rump."
        },
        {
          name: "Prize Pool",
          desc: "Bacon ipsum dolor amet pastrami porchetta filet mignon, andouille flank ham hock jerky ribeye short ribs venison ham pig biltong beef t-bone. Corned beef cupim jowl kielbasa. Pastrami jowl capicola turkey ham hock chuck.\n Biltong meatloaf shankle strip steak capicola cow shank doner t-bone landjaeger kevin ball tip beef ribs jowl. Flank shank corned beef, chuck andouille ham hock spare ribs cupim cow rump."
        }
      ];
      this.setState(desc[value]);
      document.querySelector(".info-title.active").classList.remove("active");
      e.target.classList.add("active");
    }
  }

  render() {
    return (
      <div className="row" style={{padding: 20}}>
        <div className="info-title-container">
          <div className="info-title active" onClick={this.onInfoClick(0)}>
            Rewards
          </div>
          <div className="info-title" onClick={this.onInfoClick(1)}>
            Tiers
          </div>
          <div className="info-title" onClick={this.onInfoClick(2)}>
            Prize Pool
          </div>
        </div>
        <div className="col col-1 info-description">
          <h3>{ this.state.name }</h3>
          {
            this.state.desc.split("\n").map(str => {
              return (
                <p>{ str }</p>
              )
            })
          }
        </div>
      </div>
    )
  }
}
