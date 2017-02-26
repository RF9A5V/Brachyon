import React, { Component } from "react";

export default class UserMatches extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sub: Meteor.subscribe("brackets", props.id, {
        onReady: () => {
          this.setState({ ready: true })
        }
      }),
      ready: false
    }
  }

  componentWillUnmount() {
    this.state.sub.stop();
  }

  profileImageOrDefault(id) {
    var user = Meteor.users.findOne(id);
    if(user && user.profile.imageUrl) {
      return user.profile.imageUrl;
    }
    return "/images/profile.png";
  }

  render() {
    var match = null;
    if(Meteor.userId()) {
      match = Matches.findOne({
        $or: [
          {"players.0.id": Meteor.userId()},
          {"players.1.id": Meteor.userId()}
        ],
        winner: null
      });
    }

    return (
      <div>
        <h4 style={{marginTop: 0}}>Your Matches</h4>
        <div className="row center submodule-bg">
          {
            match ? (
              <div>
                <div className="col" style={{marginBottom: 10, width: 400, marginRight: 10}}>
                  <div className="row flex-pad x-center" style={{backgroundColor: "#666"}}>
                    <img src={this.profileImageOrDefault(match.players[0].id)} style={{width: 100, height: 100}} />
                    <div className="col-1 col x-center" style={{padding: 10}}>
                      <span style={{alignSelf: "flex-start"}}>{ match.players[0].alias }</span>
                      <h5 style={{margin: "10px 0"}}>VERSUS</h5>
                      <span style={{alignSelf: "flex-end"}}>{ match.players[1].alias }</span>
                    </div>
                    <img src={this.profileImageOrDefault(match.players[1].id)} style={{width: 100, height: 100}} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="row center">
                <h5>You have no more matches for this bracket!</h5>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}
