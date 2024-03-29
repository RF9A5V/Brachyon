import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import { withRouter, browserHistory } from "react-router"

import Main from "./modules/main.jsx";

import CreateContainer from "/imports/components/public/create/create_container.jsx";

import { createContainer } from "meteor/react-meteor-data";

import LoaderContainer from "/imports/components/public/loader_container.jsx";

// Details stuff
import DescriptionPage from "./modules/details/description.jsx";
import LocationPage from "./modules/details/location.jsx";
import DatetimePage from "./modules/details/datetime.jsx";
import ImagePage from "./modules/details/image.jsx";

import Title from "./create/title.jsx";
import Privacy from "./create/privacy.jsx";
import ImageForm from "../public/img_form.jsx";
import Editor from "../public/editor.jsx";
import DateTimeSelector from "../public/datetime_selector.jsx";
import Location from "../events/create/location_select.jsx";

// Bracket Stuff
import BracketPanel from "./create/module_dropdowns/brackets.jsx";

// Stream Stuff
import StreamAdd from "./modules/stream/add.jsx";
import StreamDetails from "./modules/stream/details.jsx";

import StreamPanel from "./create/module_dropdowns/stream.jsx";

// Ticket Stuff
import TicketDetails from "./modules/tickets/details.jsx";
import TicketEdit from "./modules/tickets/edit.jsx";

// Staff
import Admins from "./modules/organize/admin.jsx";

import CloseModal from "/imports/components/events/admin/close_modal.jsx";
import RerunModal from "/imports/components/events/admin/rerun_modal.jsx";

import Brackets from "/imports/api/brackets/brackets.js"
import Instances from "/imports/api/event/instance.js";
import { Banners } from "/imports/api/event/banners.js"

class EventAdminPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      ready: false
    };
  }

  componentDidMount() {
    // if(!event || !instance) {
    //   toastr.error("Event not found.");
    //   return browserHistory.push("/");
    // }
    this.props.router.setRouteLeaveHook(this.props.route, () => {
      const event = Events.findOne();
      const instance = Instances.findOne();
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
    const event = Events.findOne();
    return {
      name: "Details",
      icon: "file",
      key: "details",
      subItems: [
        {
          name: "Title",
          key: "name",
          content: (
            Title
          ),
          args: {
            title: event.details.name,
            slug: event.slug,
            generateFromTitle: false
          }
        },
        {
          name: "Privacy",
          key: "privacy",
          content: (
            Privacy
          ),
          args: {
            ...(event.details.privacy || {})
          }
        },
        {
          name: "Description",
          key: "description",
          content: (
            Editor
          ),
          args: {
            value: event.details.description
          }
        },
        {
          name: "Location",
          key: "location",
          content: (
            Location
          ),
          args: {
            ...event.details.location
          }
        },
        {
          name: "Date",
          key: "datetime",
          content: (
            DateTimeSelector
          ),
          args: {
            init: event.details.datetime
          }
        },
        {
          name: "Banner",
          key: "image",
          content: (
            ImageForm
          ),
          args: {
            aspectRatio: 16/9,
            url: event.details.bannerUrl
          }
        }
      ]
    }
  }

  bracketItems() {
    var event = Events.findOne();
    var instance = Instances.findOne();
    var subs;
    subs = [{
      name: "Brackets",
      key: "brackets",
      content: BracketPanel,
      args: {
        brackets: instance.brackets || null,
        isLeague: event.league != null,
        onBracketNumberChange: () => {}
      }
    }];
    return {
      name: "Brackets",
      icon: "sitemap",
      key: "brackets",
      subItems: subs,
      toggle: !Events.findOne().league,
      initialToggleState: instance.brackets && instance.brackets.length > 0,
      toggleAction: (next) => {
        const action = instance.brackets ? "removeModule" : "addModule";
        Meteor.call(`events.${action}.brackets`, event._id, (err) => {
          if(err) {
            return toastr.error(err.reason);
          }
          this.forceUpdate();
        });
      }
    }
  }

  streamItems() {
    var event = Events.findOne();

    var subs = [{
      content: StreamPanel,
      name: "",
      key: "stream",
      args: {
        stream: ((event.stream || {}).twitchStream || {}).name
      }
    }];

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
    items.push({
      name: "Staff",
      icon: "users",
      key: "staff",
      subItems: [
        {
          content: Admins,
          name: "admins",
          key: "admins"
        }
      ]
    })
    // items.push(this.ticketItems());
    return items;
  }

  save() {
    var attrs = this.refs.editor.value();
    var event = Events.findOne();

    Object.keys(event.details).forEach(k => {
      if(event.details[k] == attrs.details[k]) {
        delete attrs.details[k];
      }
    });
    var imgTemp;
    if(attrs.details.image != null) {
      var file = attrs.details.image.image;
      imgTemp = JSON.parse(JSON.stringify(attrs.details.image));
      imgTemp.image = file;
    }

    attrs.slug = attrs.details.name.slug;
    attrs.details.name = attrs.details.title;

    delete attrs.details.image;

    if(attrs.creator.id == event.owner) {
      delete attrs.creator;
    }
    const slugChanged = attrs.slug != event.slug;
    Meteor.call("events.edit", event._id, attrs, (err, data) => {
      if(err) {
        return toastr.error(err.reason);
      }
      else {
        if(!imgTemp && slugChanged) {
          window.location = `/event/${attrs.slug}/edit`;
        }
        return toastr.success("Saved event info!");
      }
    });
    if(imgTemp) {
      imgTemp.meta.eventSlug = event.slug;
      toastr.warning("Uploading event image...");
      Banners.insert({
        file: imgTemp.image,
        meta: imgTemp.meta,
        fileName: event._id + "." + imgTemp.type,
        onUploaded: (err, data) => {
          if(err) {
            return toastr.error(err.reason, "Error!");
          }
          toastr.success("Updated event banner!");
          if(slugChanged) {
            window.location = `/event/${attrs.slug}/edit`;
          }
        }
      })
    }
  }

  actions() {
    return [
      {
        name: "Save All",
        icon: "floppy-o",
        action: this.save.bind(this)
      },
      {
        name: "Rerun",
        icon: "refresh",
        action: () => {
          this.setState({
            rerunOpen: true
          })
        }
      },
      {
        name: "Close",
        icon: "times",
        action: () => {
          this.setState({
            open: true
          });
        }
      }
    ]
  }

  render() {
    if(!this.state.ready){
      return (
        <div className="col center x-center" style={{width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.8)", position: "fixed"}}>
          <LoaderContainer ready={this.props.ready} onReady={() => { this.setState({ ready: true }) }} />
        </div>
      )
    }
    return (
      <div className="box col">
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
  //const paymentHandle = Meteor.subscribe("ticketHolders", props.params.slug);
  return {
    ready: eventHandle.ready()
  }
}, EventAdminPage))
