import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import { withRouter } from "react-router"

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";
import Main from "./modules/main.jsx";

import CreateContainer from "/imports/components/public/create/create_container.jsx";

import { createContainer } from "meteor/react-meteor-data";

// Details stuff
import DescriptionPage from "./modules/details/description.jsx";
import LocationPage from "./modules/details/location.jsx";
import DatetimePage from "./modules/details/datetime.jsx";
import ImagePage from "./modules/details/image.jsx";

import BracketsMain from "./admin/modules/brackets/main.jsx";
import AddBracket from "./modules/bracket/add.jsx";
import EditBracket from "./modules/bracket/edit.jsx";
import BracketInfo from "./modules/bracket/details.jsx";

import Unpublish from "./admin/modules/unpublish.jsx";
import EditModules from "./admin/modules/edit_modules.jsx";
import Close from "./admin/modules/close_event.jsx";

import Brackets from "/imports/api/brackets/brackets.js"
import Instances from "/imports/api/event/instance.js";
import { Banners } from "/imports/api/event/banners.js"

class EventAdminPage extends Component {

  componentDidMount() {
    this.props.router.setRouteLeaveHook(this.props.route, () => {
      var instance = Instances.findOne();
      if(instance.brackets && instance.brackets.length == 0) {
        return "You have to add a bracket if you want the bracket module.";
      }
    })
  }

  componentWillUnmount() {
    var instance = Instances.findOne();
    if(instance.brackets && instance.brackets.length == 0) {
      Meteor.call("events.removeModule.brackets", Events.findOne()._id);
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
      subs.push({
        content: AddBracket,
        name: "Add Bracket",
        key: "add",
        args: {
          update: this.forceUpdate.bind(this)
        }
      });
    }
    return {
      name: "Brackets",
      icon: "sitemap",
      key: "brackets",
      subItems: subs,
      toggle: true,
      initialToggleState: instance.brackets && instance.brackets.length > 0,
      toggleAction: (next) => {
        if(instance.brackets) {
          Meteor.call("events.removeModule.brackets", Events.findOne()._id, (err) => {
            if(err) {
              return toastr.error(err.reason);
            }
            this.forceUpdate();
          });
        }
        else {
          Meteor.call("events.addModule.brackets", Events.findOne()._id, (err) => {
            if(err) {
              return toastr.error(err.reason);
            }
            this.forceUpdate();
          })
        }
      }
    }

  }

  items() {
    var event = Events.findOne();
    var instance = Instances.findOne();
    var items = [];
    items.push(this.detailItems());
    items.push(this.bracketItems());
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
      </div>
    )
  }
}

export default withRouter(createContainer(props => {
  const eventHandle = Meteor.subscribe("event", props.params.slug);
  return {
    ready: eventHandle.ready()
  }
}, EventAdminPage))
