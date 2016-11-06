import React, { Component } from "react";

import Instances from "/imports/api/event/instance.js";

export default class EditModuleList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      moduleActive: false,
      subActive: false,
      submodules: [],
      item: {},
      id: Events.findOne()._id
    }
  }

  modules() {
    var event = Events.findOne();
    var nonReviewModules = [
      {
        name: "brackets",
        items: [
          {
            name: "main",
            info: "Bacon ipsum dolor amet spare ribs leberkas ball tip, short ribs shank venison t-bone jerky tongue frankfurter shoulder pastrami short loin picanha. Prosciutto tenderloin alcatra pig rump burgdoggen venison beef frankfurter pork belly. Jowl porchetta landjaeger, tenderloin cupim swine ham tail capicola."
          }
        ]
      },
      {
        name: "tickets",
        items: [
          {
            name: "main",
            info: "Bacon ipsum dolor amet spare ribs leberkas ball tip, short ribs shank venison t-bone jerky tongue frankfurter shoulder pastrami short loin picanha. Prosciutto tenderloin alcatra pig rump burgdoggen venison beef frankfurter pork belly. Jowl porchetta landjaeger, tenderloin cupim swine ham tail capicola."
          }
        ]
      },
      {
        name: "organize",
        items: [
          {
            name: "main",
            info: "Bacon ipsum dolor amet spare ribs leberkas ball tip, short ribs shank venison t-bone jerky tongue frankfurter shoulder pastrami short loin picanha. Prosciutto tenderloin alcatra pig rump burgdoggen venison beef frankfurter pork belly. Jowl porchetta landjaeger, tenderloin cupim swine ham tail capicola."
          },
          // {
          //   name: "staff",
          //   info: "Bacon ipsum dolor amet spare ribs leberkas ball tip, short ribs shank venison t-bone jerky tongue frankfurter shoulder pastrami short loin picanha. Prosciutto tenderloin alcatra pig rump burgdoggen venison beef frankfurter pork belly. Jowl porchetta landjaeger, tenderloin cupim swine ham tail capicola."
          // },
          {
            name: "schedule",
            info: "Bacon ipsum dolor amet spare ribs leberkas ball tip, short ribs shank venison t-bone jerky tongue frankfurter shoulder pastrami short loin picanha. Prosciutto tenderloin alcatra pig rump burgdoggen venison beef frankfurter pork belly. Jowl porchetta landjaeger, tenderloin cupim swine ham tail capicola."
          }
        ]
      }
    ];
    var reviewModules = [
      {
        name: "crowdfunding",
        items: [
          {
            name: "main",
            info: "Bacon ipsum dolor amet spare ribs leberkas ball tip, short ribs shank venison t-bone jerky tongue frankfurter shoulder pastrami short loin picanha. Prosciutto tenderloin alcatra pig rump burgdoggen venison beef frankfurter pork belly. Jowl porchetta landjaeger, tenderloin cupim swine ham tail capicola."
          },
          {
            name: "rewards",
            info: "Bacon ipsum dolor amet spare ribs leberkas ball tip, short ribs shank venison t-bone jerky tongue frankfurter shoulder pastrami short loin picanha. Prosciutto tenderloin alcatra pig rump burgdoggen venison beef frankfurter pork belly. Jowl porchetta landjaeger, tenderloin cupim swine ham tail capicola."
          },
          {
            name: "tiers",
            info: "Bacon ipsum dolor amet spare ribs leberkas ball tip, short ribs shank venison t-bone jerky tongue frankfurter shoulder pastrami short loin picanha. Prosciutto tenderloin alcatra pig rump burgdoggen venison beef frankfurter pork belly. Jowl porchetta landjaeger, tenderloin cupim swine ham tail capicola."
          }
        ]
      }
    ];
    return [
      {
        name: "Non-Review Modules",
        list: nonReviewModules
      },
      {
        name: "Review Modules",
        list: reviewModules
      }
    ];
  }

  onModuleSelect(value, items) {
    if(this.state.name == value) {
      this.setState({
        moduleActive: false,
        subActive: false,
        name: "",
        item: {}
      })
    }
    else {
      this.setState({
        moduleActive: true,
        subActive: true,
        name: value,
        submodules: items,
        item: items[0]
      })
    }
  }

  onSubmoduleSelect(value) {
    if(this.state.item.name == value.name) {
      this.setState({
        subActive: false,
        item: {}
      })
    }
    else {
      this.setState({
        subActive: true,
        item: value
      })
    }
  }

  createModule() {
    Meteor.call("events.createModule", this.state.id, this.state.name, this.state.item.name, (err) => {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully updated module.", "Success!");
        this.props.onItemSelect(this.props.count);
        this.forceUpdate();
      }
    })
  }

  deleteModule() {
    Meteor.call("events.deleteModule", this.state.id, this.state.name, this.state.item.name, (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully deleted module.", "Success!");
        this.forceUpdate();
      }
    })
  }

  buttonSelect() {
    var event = Events.findOne();
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    if(this.state.item.name == "main") {
      if(event[this.state.name] != null || instance[this.state.name] != null) {
        return (
          <button onClick={ this.deleteModule.bind(this) }>Delete</button>
        )
      }
      else {
        return (
          <button onClick={ this.createModule.bind(this) }>Create</button>
        )
      }
    }
    else {
      if((event[this.state.name] || {})[this.state.item.name] == null) {
        return (
          <button onClick={ this.createModule.bind(this) }>Create</button>
        )
      }
      return (
        <button onClick={ this.deleteModule.bind(this) }>Delete</button>
      )
    }
  }

  render() {
    var modules = this.modules();
    return (
      <div>
        <div className="submodule-bg">
          <div className="row">
            <div className="module-container">
              {
                modules.map(section => {
                  return (
                    <div>
                      <div className="row center">
                        <h3 className="section-header">{ section.name }</h3>
                      </div>
                      {
                        section.list.map(module => {
                          return (
                            <div className={`module-title ${this.state.name == module.name ? "active" : ""}`} onClick={() => { this.onModuleSelect(module.name, module.items) }}>
                              { module.name.slice(0, 1).toUpperCase() + module.name.slice(1) }
                            </div>
                          )
                        })
                      }
                    </div>
                  )
                })
              }
            </div>
            {
              this.state.moduleActive ? (
                <div className="module-container">
                  <h5 className={`section-header clickable ${this.state.item.name == this.state.submodules[0].name ? "active" : ""}`} onClick={() => {
                    this.onSubmoduleSelect(this.state.submodules[0])
                  }}>{ this.state.name.slice(0, 1).toUpperCase() + this.state.name.slice(1) }</h5>
                  <div className="row center">
                    <hr style={{margin: "27px 0", width: "50%"}} />
                  </div>
                  {
                    this.state.submodules.slice(1).map(item => {
                      return (
                        <div className={`module-title ${this.state.item.name == item.name ? "active" : ""}`} onClick={() => {
                          this.onSubmoduleSelect(item)
                        }}>
                          { item.name.slice(0, 1).toUpperCase() + item.name.slice(1) }
                        </div>
                      )
                    })
                  }
                </div>
              ) : (
                ""
              )
            }
            {
              this.state.subActive ? (
                <div className="module-container">
                  <div className="row center">
                    <h3 className="section-header">{ this.state.item.name == "main" ? this.state.name.slice(0, 1).toUpperCase() + this.state.name.slice(1) : this.state.item.name.slice(0, 1).toUpperCase() + this.state.item.name.slice(1) }</h3>
                  </div>
                  <p>
                    { this.state.item.info }
                  </p>
                  <div className="row center">
                    {
                      this.state.item.name == "main" || this.state.name == "organize" ? this.buttonSelect() : ""
                    }
                  </div>
                </div>
              ) : (
                ""
              )
            }
          </div>
        </div>
      </div>
    )
  }
}
