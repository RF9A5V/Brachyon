import React, { Component } from "react";
import moment from "moment";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

// Container to handle generic block objects for discovery

export default class BlockContainer extends Component {

  profileImageOrDefault(id) {
    var user = Meteor.users.findOne(id);
    return user && user.profile.imageUrl ? user.profile.imageUrl : "/images/profile.png";
  }

  navRowContent(obj) {
    if(obj.type == "instance") {
      return null;
    }
    var icons = [];
    if(obj.type == "event") {
      icons.push(<FontAwesome name="file-text" onClick={() => { browserHistory.push("/event/" + obj.slug) }} />);

      var instance = Instances.findOne(obj.instances[obj.instances.length - 1]);
      if(instance && instance.brackets) {
        icons.push(<FontAwesome name="sitemap" onClick={() => { browserHistory.push("/event/" + obj.slug + "/brackets") }} />)
      }
    }
    else {
      return null;
    }
    return (
      <div className="event-block-nav">
        { icons }
      </div>
    );
  }

  singleBracketFormat(obj) {
    var username = Meteor.users.findOne(obj.owner) ? Meteor.users.findOne(obj.owner).username : "";
    var participantCount = (obj.type == "instance" || obj.type == "event") ? (
      (() => {
        if(!obj.instances || obj.instances.length == 0) {
          return 0;
        }
        var instId = obj.instances[obj.instances.length - 1];
        if(!instId) {
          return 0;
        }
        var instance = Instances.findOne(instId) || {};
        var count = 0;
        if(instance.brackets) {
          instance.brackets.forEach(bracket => {
            if(bracket.participants) {
              count += bracket.participants.length;
            }
          });
        }
        return count;
      })()
    ) : (
      (() => {
        var keys = {};
        obj.leaderboard.forEach(board => {
          Object.keys(board).forEach(k => {
            keys[k] = 1;
          })
        });
        return Object.keys(keys).length;
      })()
    );
    var title = (obj.type == "instance") ? obj.brackets[0].name || "Bracket" : obj.details.name;
    var img = obj.type == "instance" ? "/images/bg.jpg" : obj.details.bannerUrl;
    if(!img) {
      img = "/images/bg.jpg";
    }

    var action = (val) => {
      return (e) => {
        e.preventDefault();
        e.stopPropagation();
        var type = obj.type;
        if(type == "instance") {
          type = "bracket";
        }
        var identifier = obj.slug || obj._id;
        browserHistory.push("/" + type + "/" + identifier + "/" + val);
      }
    }

    return (
      <div className={`event-block ${obj.type}`} onClick={action("")}>
        <div style={{borderStyle: "solid", borderWidth: 2, position: "relative"}}>
          <h2 className="event-block-title">{ title }</h2>
          {
            Meteor.userId() == obj.owner ? (
              <div className="event-block-admin-row">
                <div className="event-block-admin-button col center x-center" onClick={action("edit")}>
                  EDIT
                </div>
              </div>
            ) : (
              ""
            )
          }
        </div>
        <div className="event-block-img" style={{backgroundImage: `url(${img})`}}>
          {
            //this.navRowContent(obj)
          }
        </div>
        <div className="event-block-content">
          <div className="col col-1">
            <div className="row flex-pad x-center" style={{marginBottom: 15}}>
              <div className="row x-center" style={{fontSize: 12}}>
                <img src={this.profileImageOrDefault(obj.owner)} style={{width: 12.5, height: "auto", marginRight: 5}} />
                { username }
              </div>
              <span style={{fontSize: 12}}>
                {
                  participantCount
                }
                <FontAwesome name="users" style={{marginLeft: 5}} />
              </span>
            </div>
            <div className="row flex-pad">
              {
                (obj.type == "event" || obj.type == "league") ? (
                  obj.location.online ? (
                    <div style={{fontSize: 12}}><FontAwesome name="signal" /> Online Event</div>
                  ) : (
                    <div style={{fontSize: 12}}>
                      <FontAwesome name="map-marker" /> {obj.location.city}, {obj.location.state}
                    </div>
                  )
                ) : (
                  ""
                )
              }
              <span style={{fontSize: 12}}>
                {moment(obj.date).format("MMM Do, YYYY")}
                <FontAwesome name="calendar" style={{marginLeft: 5}} />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  joinCollections() {
    var leagues = Leagues.find().map(obj => {
      var events = Events.find({ league: obj._id }).fetch();
      obj.date = events[0].details.datetime;
      obj.location = events[0].details.location;
      obj.type = "league";
      return obj;
    });
    var events = Events.find({ league: null }).map(obj => {
      obj.type = "event";
      obj.date = obj.details.datetime;
      obj.location = obj.details.location;
      return obj;
    });
    var instances = Instances.find({ owner: { $ne: null } }).map(obj => {
      obj.type = "instance";
      return obj;
    });
    var combo = leagues.concat(events).concat(instances).sort((a, b) => {
      return moment(a.date).isBefore(b.date) ? 1 : -1;
    });
    return combo.map((obj) => {
      return this.singleBracketFormat(obj);
    })
  }

  render() {
    return (
      <div className="event-block-container">
        { this.joinCollections() }
      </div>
    )
  }
}
