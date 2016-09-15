import React, { Component } from "react";

export default class FeaturedList extends Component {

  constructor(props) {
    super(props);
    var event = Events.findOne();
    var participants = new Set();
    event.brackets.forEach((bracket) => {
      var players = bracket.participants;
      players.forEach((player) => {
        if(player.id){
          participants.add(player.id);
        }
      })
    });
    this.state = {
      id: event._id,
      topThree: (event.promotion || {}).featured || [],
      participants: Array.from(participants)
    }
  }

  imgOrDefault(user) {
    if(user.profile.image){
      return ProfileImages.findOne(user.profile.image).url();
    }
    return "/images/profile.png";
  }

  onFeatureToggle(id) {
    var hasElement = this.state.topThree.some((item) => {
      return item == id;
    });
    if(hasElement){
      var index = this.state.topThree.indexOf(id);
      this.state.topThree.forEach((elem, i) => {
        this.refs[elem].classList.remove("placement1", "placement2", "placement3");
        if(index != i){
          if(i < index) {
            this.refs[elem].classList.add("placement" + (i + 1));
          }
          else {
            this.refs[elem].classList.add("placement" + i);
          }
        }
      });
      this.state.topThree.splice(index, 1);
    }
    else {
      if(this.state.topThree.length >= 3){
        toastr.error("Can only add three top names.", "Error!");
        return false;
      }
      this.state.topThree.push(id);
      this.refs[id].classList.add("placement"+this.state.topThree.length);
    }
    this.forceUpdate();
  }

  intToClass(number) {
    if(number == 0){
      return "first";
    }
    if(number == 1){
      return "second";
    }
    if(number == 2){
      return "third";
    }
    return "";
  }

  onTopSave() {
    Meteor.call("events.promotion.setFeatured", this.state.id, this.state.topThree, (err) => {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      else {
        return toastr.success("Successfully set top three!", "Success!");
      }
    })
  }

  render() {
    return (
      <div className="col">
        <div className="row x-center">
          <div className="col-1">
          </div>
          <span>Featured</span>
          <div className="row col-1" style={{justifyContent: "flex-end"}}>
            <button onClick={this.onTopSave.bind(this)}>Save</button>
          </div>
        </div>
        <div className="row">
        {
          this.state.participants.map((participant) => {
            var user = Meteor.users.findOne(participant);
            return (
              <div className="user-block" ref={participant} key={participant} onClick={() => { this.onFeatureToggle(participant) }}>
                <img src={ this.imgOrDefault(user) }/>
                <div>
                  <span>{ user.username }</span>
                </div>
                {
                  this.state.topThree.indexOf(participant) >= 0 ? (
                    <div className={`user-block-decorator ${this.intToClass(this.state.topThree.indexOf(participant))}`}>
                      { this.state.topThree.indexOf(participant) + 1 }
                    </div>
                  ) : (
                    ""
                  )
                }
              </div>
            )
          })
        }
        </div>
      </div>
    )
  }
}
