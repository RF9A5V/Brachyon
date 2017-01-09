import React, { Component } from "react";
import moment from "moment";
import { browserHistory } from "react-router";

import DetailsPanel from "./create/details.jsx";
import CrowdfundingPanel from "./create/module_dropdowns/crowdfunding.jsx";
import BracketsPanel from "./create/module_dropdowns/brackets.jsx";
import BotPanel from "./create/module_dropdowns/bot.jsx";
import PromotionPanel from "./create/module_dropdowns/promotion.jsx";
import StreamPanel from "./create/module_dropdowns/stream.jsx";
import ModuleBlock from "./create/module_block.jsx";

import { Banners } from "/imports/api/event/banners.js";

export default class EventCreateScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      moduleState: {
        details: {
          active: true
        },
        brackets: {
          active: false
        },
        stream: {
          active: false
        },
        crowdfunding: {
          active: false
        },
      },
      currentItem: "details",
      creator: {
        type: "user",
        id: Meteor.userId()
      },
      organizations: Meteor.subscribe("userOrganizations", Meteor.userId(), {
        onReady: () => { this.setState({ ready: true }) }
      }),
      attrs: {
        details: {
          date: moment().toDate(),
          time: moment().add(1, "hour").startOf("hour").toDate()
        }
      },
      ready: false
    }
  }

  componentWillUnmount() {
    if(this.state.organizations) {
      this.state.organzations.stop();
    }
  }

  availableModules() {
    return [
      {
        name: "details",
        icon: "file-text",
        requiresReview: false,
        selected: this.state.moduleState["details"].active
      },
      {
        name: "brackets",
        icon: "sitemap",
        requiresReview: false,
        selected: this.state.moduleState["brackets"].active
      },
      {
        name: "stream",
        icon: "video-camera",
        requiresReview: false,
        selected: this.state.moduleState["stream"].active
      },
      {
        name: "crowdfunding",
        icon: "usd",
        requiresReview: true,
        selected: this.state.moduleState["crowdfunding"].active
      }
    ];
  }

  currentPanel() {
    var item = (
      <div></div>
    );
    var generator = (value) => {
      return () => {
        this.state.moduleState[value].active = !this.state.moduleState[value].active;
        if(this.state.moduleState[value].active) {
          this.state.attrs[value] = {};
        }
        else {
          delete this.state.attrs[value];
        }
        this.forceUpdate();
      }
    }
    var isActive = (value) => {
      return this.state.moduleState[value].active;
    }
    switch(this.state.currentItem) {
      case "details":
        item = <DetailsPanel attrs={this.state.attrs} />
        break;
      case "crowdfunding":
        item = <CrowdfundingPanel attrs={this.state.attrs} selected={isActive("crowdfunding")} onToggle={generator("crowdfunding")}/>
        break;
      case "brackets":
        item = <BracketsPanel attrs={this.state.attrs} onToggle={generator("brackets")} selected={isActive("brackets")} />
        break;
      case "stream":
        item = <StreamPanel attrs={this.state.attrs} selected={isActive("stream")} onToggle={generator("stream")} />
        break;
      default:
        break;
    }
    return (
      <div style={{padding: 20, backgroundColor: "#666"}}>
        { item }
      </div>
    )
  }

  submit(e) {
    e.preventDefault();

    var imgRef;
    if(this.state.attrs.details.image != null) {
      imgRef = {
        file: this.state.attrs.details.image.file,
        meta: this.state.attrs.details.image.meta
      };
    }
    this.state.attrs.details.datetime = moment(this.state.attrs.details.date).format("YYYYMMDD") + "T" + moment(this.state.attrs.details.time).format("HHmm");
    delete this.state.attrs.details.date;
    delete this.state.attrs.details.time;
    delete this.state.attrs.details.image;
    this.state.attrs.creator = this.state.creator;
    if(this.state.attrs.brackets) {
      this.state.attrs.brackets = Object.keys(this.state.attrs.brackets).map(key => {
        var obj = this.state.attrs.brackets[key];
        if(!obj.game) {
          obj.game = obj.gameObj._id;
          delete obj.gameObj;
        }
        return obj;
      });
    }
    Meteor.call("events.create", this.state.attrs, (err, event) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        //var href = unpub ? `/events/${event}/edit` : `/events/${event}/show`;
        var href = `/events/${event}/show`;
        if(imgRef) {
          imgRef.meta.eventSlug = event;
          var dataSeg = imgRef.file.substring(imgRef.file.indexOf("/"), imgRef.file.indexOf(";")).slice(1);
          Banners.insert({
            file: imgRef.file,
            isBase64: true,
            meta: imgRef.meta,
            fileName: event + "." + dataSeg,
            onUploaded: (err, data) => {
              if(err) {
                return toastr.error(err.reason, "Error!");
              }
              toastr.success("Successfully created event!");
              browserHistory.push(href);
            }
          })
        }
        else {
          browserHistory.push(href);
        }
      }
    })
  }

  buttons() {
    var reviewRequired = false;
    return (
      <div style={{marginBottom: 20}}>
        {
          reviewRequired ? (
            <button onClick={this.submit.bind(this)}>Advanced Options</button>
          ) : (
            <button onClick={this.submit.bind(this)}>Publish</button>
          )
        }
      </div>
    );
  }

  onTypeSelect(e) {
    if(e.target.value == 0) {
      this.setState({
        creator: {
          type: "user",
          id: Meteor.userId()
        }
      });
    }
    else {
      this.setState({
        creator: {
          type: "organization",
          id: e.target.value
        }
      })
    }
  }

  modulePanels() {
    var modules = this.availableModules();
    var keys = Object.keys(modules);
    var generator = (value) => {
      return () => {
        if(value == "details") {
          return;
        }
        if(value == "crowdfunding") {
          if(!Meteor.isDevelopment){
            return toastr.warning("Under construction!", "Warning!");
          }
        }
        this.state.moduleState[value].active = !this.state.moduleState[value].active;
        this.forceUpdate();
      }
    }
    return keys.map((key, index) => {
      var mod = modules[key];
      return (
        <ModuleBlock
          modName={mod.name}
          icon={mod.icon}
          isActive={this.state.currentItem == mod.name}
          callback={() => {
            this.setState({
              currentItem: mod.name
            })
          }}
          isOn={this.state.moduleState[mod.name].active}
          onToggle={generator(mod.name)}
          toggleable={mod.name == "details"}
        />
      );
    })
  }

  render() {
    var self = this;
    if(!this.state.ready) {
      return (
        <div>
        </div>
      )
    }
    return (
      <div className='box'>
        <div className='col' style={{padding: 20}}>
          <div className="row flex-pad x-center" style={{marginBottom: 20}}>
            <div className="row">
            {
              this.modulePanels()
            }
            </div>
            <div className="col" style={{padding: 10, backgroundColor: "#666"}}>
              <span style={{marginBottom: 5}}>Create As</span>
              <select defaultValue={0} onChange={this.onTypeSelect.bind(this)}>
                <option value={0}>User - {Meteor.user().username}</option>
                {
                  Organizations.find().map(o => {
                    return (
                      <option value={o._id}>
                        Organization - { o.name }
                      </option>
                    )
                  })
                }
              </select>
            </div>
          </div>
          <div className="col" style={{marginBottom: 20}}>
            {
              this.currentPanel()
            }
          </div>
          <div className="row center">
            {
              this.buttons()
            }
          </div>
        </div>
      </div>
    )
  }
}
