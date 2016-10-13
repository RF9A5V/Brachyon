import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import moment from "moment";
import Modal from "react-modal";

import Loading from "/imports/components/public/loading.jsx";

import { ProfileImages } from "/imports/api/users/profile_images.js";

export default class RemoveEventAction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      eventID: null,
      open: false,
      events: Meteor.subscribe("searchEvents", {}, {
        onReady: () => {
          this.setState({
            eventsReady: true
          })
        }
      }),
      eventsReady: false
    }
  }

  componentWillUnmount() {
    this.state.events.stop();
  }

  onSearchSubmit() {
    this.state.events.stop();
    var query = {
      "name": this.refs.name.value
    }
    this.setState({
      eventsReady: false,
      events: Meteor.subscribe("searchEvents", query, {
        onReady: () => {
          this.setState({eventsReady: true})
        }
      })
    });
  }

  events() {
    return Events.find();
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

  profileImageOrDefault(id) {
    var img = ProfileImages.findOne(id);
    if(!img) {
      return "/images/profile.png";
    }
    return img.link();
  }

  deleteEvent() {
    Meteor.call("events.delete", this.state.eventID, (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.setState({ eventID: null, open: false })
        return toastr.success("Successfully deleted event!", "Success!");
      }
    })
  }

  unpublishEvent() {
    Meteor.call("events.unpublish", this.state.eventID, (err) => {
      if(err) {
        return toastr.error(err.reason);
      }
      else {
        this.setState({ eventID: null });
        return toastr.success("Successfully unpublished event!", "Success!");
      }
    })
  }

  eventList() {
    return (
      <div>
        <div className="row x-center center">
          <input type="text" placeholder="Event Name" ref="name"/>
          <button onClick={() => { this.onSearchSubmit() }}>
            <FontAwesome name="search" />
          </button>
        </div>
        <div className="row x-center" style={{flexWrap: "wrap"}}>
          {
            this.events().map((event, i) => {
              return (
                <div className="event-block col" key={i} onClick={() => { this.setState({ eventID: event._id }) }}>
                  <h2 className="event-block-title">{ event.details.name }</h2>
                  <img src={this.imgOrDefault(event)} />
                  <div className="event-block-content">
                    <div className="col">
                      <div className="row flex-pad x-center" style={{marginBottom: 10}}>
                        <div className="row x-center" style={{fontSize: 12}}>
                          <img src={this.profileImageOrDefault(Meteor.users.findOne(event.owner).profile.image)} style={{width: 12.5, height: "auto", marginRight: 5}} />{ Meteor.users.findOne(event.owner).username }
                        </div>
                      </div>
                      <div className="row flex-pad">
                        {
                          event.details.location.online ? (
                            <div style={{fontSize: 12}}><FontAwesome name="signal" /> Online Event</div>
                          ) : (
                            <div style={{fontSize: 12}}>
                              <FontAwesome name="map-marker" /> {event.details.location.city}, {event.details.location.state}
                            </div>
                          )
                        }
                        <span style={{fontSize: 12}}>
                          {moment(event.details.datetime).format("MMM Do, YYYY")}
                          <FontAwesome name="calendar" style={{marginLeft: 5}} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }

  eventDisplay() {
    var event = Events.findOne(this.state.eventID);
    return (
      <div>
        <h3>{ event.details.name }</h3>
        <img src={this.imgOrDefault(event)} style={{width: 400, height: "auto", margin: "20px 0"}} />
        <h5>Description</h5>
        {
          event.details.description.split("\n").map(para => {
            return (
              <p>
                { para }
              </p>
            )
          })
        }
        <div className="row x-center" style={{position: "fixed", bottom: 60, right: 20}}>
          <button style={{marginRight: 10}} onClick={() => { this.setState({ open: true }) }}>Delete</button>
          <button style={{marginRight: 10}} onClick={() => { this.unpublishEvent() }}>Unpublish</button>
          <button onClick={() => { this.setState({ eventID: null }) }}>Back</button>
        </div>
        <Modal isOpen={this.state.open} onRequestClose={() => { this.setState({ open: false }) }}>
          <div>
            <div className="row center">
              <h1>WARNING</h1>
            </div>
            <div className="row center">
              <p>This action will be irreversable! Are you sure you want to continue?</p>
            </div>
            <div className="row center">
              <button style={{marginRight: 10}} onClick={() => { this.deleteEvent() }}>
                Yes
              </button>
              <button onClick={() => { this.setState({ open: false }) }}>
                No
              </button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  render() {
    if(!this.state.eventsReady) {
      return <Loading />
    }
    if(this.state.eventID) {
      return this.eventDisplay();
    }
    return this.eventList();
  }
}
