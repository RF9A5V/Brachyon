import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import { withRouter, browserHistory } from "react-router"

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";
import Main from "./modules/main.jsx";

import CreateContainer from "/imports/components/public/create/create_container.jsx";

import { createContainer } from "meteor/react-meteor-data";

// Details stuff
import DescriptionPage from "./modules/details/description.jsx";
import LocationPage from "./modules/details/location.jsx";
import DatetimePage from "./modules/details/datetime.jsx";
import ImagePage from "./modules/details/image.jsx";

// Bracket Stuff
import BracketsMain from "./admin/modules/brackets/main.jsx";
import AddBracket from "./modules/bracket/add.jsx";
import EditBracket from "./modules/bracket/edit.jsx";
import BracketInfo from "./modules/bracket/details.jsx";

// Stream Stuff
import StreamAdd from "./modules/stream/add.jsx";
import StreamDetails from "./modules/stream/details.jsx";

// Ticket Stuff
import TicketDetails from "./modules/tickets/details.jsx";
import TicketEdit from "./modules/tickets/edit.jsx";

import CloseModal from "/imports/components/events/admin/close_modal.jsx";
import RerunModal from "/imports/components/events/admin/rerun_modal.jsx";

import Brackets from "/imports/api/brackets/brackets.js"
import Instances from "/imports/api/event/instance.js";
import { Banners } from "/imports/api/event/banners.js"

class EventAdminPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  componentDidMount() {
    const event = Events.findOne();
    const instance = Instances.findOne();
    if(!event || !instance) {
      toastr.error("Event not found.");
      return browserHistory.push("/");
    }
    this.props.router.setRouteLeaveHook(this.props.route, () => {
      if(instance.brackets && instance.brackets.length == 0) {
        return "You have to add a bracket if you want the bracket module.";
      }
      if(event.stream && event.stream.twitchStream == "") {
        return "You have to provide a twitch username for your twitch stream!";
      }
    })
  }

  componentWillUnmount() {
    const event = Events.findOne();
    const instance = Instances.findOne();
    if(!event || !instance) {
      return;
    }
    if(instance.brackets && instance.brackets.length == 0) {
      Meteor.call("events.removeModule.brackets", event._id);
    }
    if(event.stream && event.stream.twitchStream == "") {
      Meteor.call("events.removeModule.stream", event._id);
    }
  }

  detailItems() {
    return {
      name: "Details",
      icon: "file",
      key: "details",
      subItems: [
        {
          name: "Description",
          key: "description",
          content: (
            DescriptionPage
          )
        },
        {
          name: "Location",
          key: "location",
          content: (
            LocationPage
          )
        },
        {
          name: "Date",
          key: "datetime",
          content: (
            DatetimePage
          )
        },
        {
          name: "Banner",
          key: "image",
          content: (
            ImagePage
          ),
          args: {
            aspectRatio: 16/9
          }
        }
      ]
    }
  }

  bracketItems() {
    var event = Events.findOne();
    var instance = Instances.findOne();
    var subs;
    if(!instance.brackets) {
      subs = [
        {
          content: BracketInfo,
          name: "Main",
          key: "main",
          args: {
            update: this.forceUpdate.bind(this)
          }
        }
      ]
    }
    else {
      subs = instance.brackets.map((b,i) => {
        return {
          name: b.name || `Bracket ${i + 1}`,
          key: i,
          content: EditBracket,
          args: {
            bracket: b,
            index: i,
            update: this.forceUpdate.bind(this)
          }
        }
      });
      if(!event.league) {
        subs.push({
          content: AddBracket,
          name: "Add Bracket",
          key: "add",
          args: {
            update: this.forceUpdate.bind(this)
          }
        });
      }

    }
    return {
      name: "Brackets",
      icon: "sitemap",
      key: "brackets",
      subItems: subs,
      toggle: !Events.findOne().league,
      initialToggleState: instance.brackets && instance.brackets.length > 0,
      toggleAction: (next) => {
        if(instance.brackets) {
          Meteor.call("events.removeModule.brackets", event._id, (err) => {
            if(err) {
              return toastr.error(err.reason);
            }
            this.forceUpdate();
          });
        }
        else {
          Meteor.call("events.addModule.brackets", event._id, (err) => {
            if(err) {
              return toastr.error(err.reason);
            }
            this.forceUpdate();
          })
        }
      }
    }
  }

  streamItems() {
    var event = Events.findOne();

    var subs = [];
    if(event.stream) {
      subs.push({
        content: StreamAdd,
        name: "Add Stream",
        key: "stream"
      });
    }
    else {
      subs.push({
        content: StreamDetails,
        name: "Stream Details",
        key: "stream"
      });
    }

    return {
      name: "Stream",
      icon: "video-camera",
      key: "stream",
      subItems: subs,
      toggle: true,
      initialToggleState: !!event.stream,
      toggleAction: () => {
        const action = event.stream ? "removeModule" : "addModule"
        Meteor.call(`events.${action}.stream`, event._id, (err) => {
          if(err) {
            toastr.error(err.reason);
          }
          else {
            this.forceUpdate();
          }
        });
      }
    }
  }

  ticketItems() {
    var subs = [];
    const tickets = Instances.findOne().tickets;
    const canToggle = !tickets || !tickets.payables || Object.keys(tickets.payables).length == 0
    if(canToggle) {
      subs = [
        {
          content: TicketEdit,
          name: "Edit",
          key: "tickets"
        }
      ];
    }
    else {
      Object.keys(tickets).forEach(k => {
        if(k == "payables" || k == "paymentType") {
          return;
        }
        const title = isNaN(k) ? "Venue" : `Bracket ${parseInt(k) + 1}`;
        subs.push({
          content: TicketDetails,
          name: title,
          key: k,
          args: {
            ticket: tickets[k]
          }
        });
      });
    }
    return {
      name: "Tickets",
      icon: "ticket",
      key: "tickets",
      subItems: subs,
      toggle: canToggle,
      initialToggleState: !!tickets,
      toggleAction: () => {
        const subAction = tickets ? "removeModule" : "addModule";
        Meteor.call(`events.${subAction}.tickets`, Events.findOne()._id, (e) => {
          if(e) {
            toastr.error(e.reason);
          }
          else {
            toastr.success("Successfully toggled ticket module.");
            this.forceUpdate();
          }
        })
      }
    }
  }

  items() {
    var event = Events.findOne();
    var instance = Instances.findOne();
    var items = [];
    items.push(this.detailItems());
    items.push(this.bracketItems());
    items.push(this.streamItems());
    items.push(this.ticketItems());
    return items;
  }

  save() {
    var attrs = this.refs.editor.value();
    var event = Events.findOne();

    var details = attrs.details;

    // I know, but bear with me.
    // This is getting refactored in like a month anyways.
    details.name = details.description.name;
    details.description = details.description.description;

    // Temporarily disabling global bracket edit
    delete attrs.brackets;

    Object.keys(event.details).forEach(k => {
      if(event.details[k] == details[k]) {
        delete details[k];
      }
    });

    var imgTemp;
    if(details.image != null) {
      var file = attrs.details.image.image;
      imgTemp = JSON.parse(JSON.stringify(attrs.details.image));
      imgTemp.image = file;
    }
    delete attrs.details.image;

    if(attrs.creator.id == event.owner) {
      delete attrs.creator;
    }

    Meteor.call("events.edit", event._id, attrs, (err) => {
      if(err) {
        return toastr.error(err.reason);
      }
    });
    if(imgTemp) {
      imgTemp.meta.eventSlug = event.slug;
      Banners.insert({
        file: imgTemp.image,
        meta: imgTemp.meta,
        onUploaded: (err, data) => {
          if(err) {
            return toastr.error(err.reason, "Error!");
          }
        }
      })
    }
  }

  actions() {
    return [
      {
        name: "Save All",
        action: this.save.bind(this)
      },
      {
        name: "Rerun",
        action: () => {
          this.setState({
            rerunOpen: true
          })
        }
      },
      {
        name: "Close",
        action: () => {
          this.setState({
            open: true
          });
        }
      }
    ]
  }

  render() {
    if(!this.props.ready){
      return (
        <div>
          Loading...
        </div>
      )
    }
    return (
      <div className="box col" style={{padding: 40}}>
        <CreateContainer ref="editor" items={this.items()} actions={this.actions()} />
        <CloseModal open={this.state.open} id={Events.findOne()._id} onClose={() => { this.setState({ open: false }) }} onComplete={() => {
          browserHistory.push("/");
        }} />
        <RerunModal open={this.state.rerunOpen} id={Events.findOne()._id} onClose={() => {
          this.setState({ rerunOpen: false });
        }} onComplete={(sub) => {
          // Hacky, but dunno how to fix
          location.href = `/event/${Events.findOne().slug}`;
        }} />
      </div>
    )
  }
}

export default withRouter(createContainer(props => {
  const eventHandle = Meteor.subscribe("event", props.params.slug);
  const paymentHandle = Meteor.subscribe("ticketHolders", props.params.slug);
  return {
    ready: eventHandle.ready()
  }
}, EventAdminPage))
