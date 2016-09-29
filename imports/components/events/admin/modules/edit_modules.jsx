import React, { Component } from "react";

export default class EditModules extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: Events.findOne()._id,
      module: {},
      submodule: {}
    }
  }

  modules() {
    return {
      promotion: {
        name: "Promotion",
        value: "promotion",
        subitems: [
          {
            name: "Promotion",
            value: "main",
            description: "Never let your guard down by thinking you’re fucking good enough. Design as if your fucking life depended on it. If you fucking give up, you will achieve nothing. Design is all about fucking relationships—the relationship of form and content, the relationship of elements, the relationship of designer and user."
          },
          {
            name: "Featured",
            value: "featured",
            description: "Never let your guard down by thinking you’re fucking good enough. Design as if your fucking life depended on it. If you fucking give up, you will achieve nothing. Design is all about fucking relationships—the relationship of form and content, the relationship of elements, the relationship of designer and user."
          }
        ]
      },
      organize: {
        name: "Organize",
        value: "organize",
        subitems: [
          {
            name: "Organize",
            value: "main",
            description: "Never let your guard down by thinking you’re fucking good enough. Design as if your fucking life depended on it. If you fucking give up, you will achieve nothing. Design is all about fucking relationships—the relationship of form and content, the relationship of elements, the relationship of designer and user."
          },
          {
            name: "Schedule",
            value: "schedule",
            description: "Never let your guard down by thinking you’re fucking good enough. Design as if your fucking life depended on it. If you fucking give up, you will achieve nothing. Design is all about fucking relationships—the relationship of form and content, the relationship of elements, the relationship of designer and user."
          }
        ]
      }
    }
  }

  onModuleClick(mod) {
    if(mod.name == this.state.module.name) {
      this.setState({
        module: {}
      })
    }
    else {
      this.setState({
        module: mod
      })
    }
  }

  onSubmoduleClick(mod) {
    if(this.state.submodule.value == mod.value) {
      this.setState({
        submodule: {}
      })
    }
    else {
      this.setState({
        submodule: mod
      })
    }
  }

  createModule() {
    Meteor.call("events.createModule", this.state.id, this.state.module.value, "main", (err) => {
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
    Meteor.call("events.deleteModule", this.state.id, this.state.module.value, "main", (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully deleted module.", "Success!");
        this.forceUpdate();
      }
    })
  }

  render() {
    var mods = this.modules();
    var event = Events.findOne();
    return (
      <div className="submodule-bg">
        <div className="row">
          <div className="submodule-section" style={{width: "15%"}}>
            {
              Object.keys(mods).map((mod) => {
                return (
                  <div className={`sub-section-select ${this.state.module.name == mods[mod].name ? "active" : ""}`} onClick={() => { this.onModuleClick(mods[mod])}}>
                    { mods[mod].name }
                  </div>
                )
              })
            }
          </div>
          {
            this.state.module.name ? (
              <div className="submodule-section" style={{width: "15%"}}>
                {
                  this.state.module.subitems.slice(1).map((item) => {
                    return (
                      <div className={`sub-section-select ${this.state.submodule.name == item.name ? "active" : ""}`} onClick={() => { this.onSubmoduleClick(item) }}>
                        { item.name }
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
            this.state.submodule.name ? (
              <div className="submodule-section col-1">
                <div className="row center">
                  <h3>{ this.state.submodule.name }</h3>
                </div>
                <p>{ this.state.submodule.description }</p>
                <div className="row center">
                  {
                    event[this.state.module.value] && event[this.state.module.value][this.state.submodule.value] ? (
                      <button onClick={() => { this.deleteModule() }}>Delete</button>
                    ) : (
                      <button onClick={() => { this.createModule() }}>Create</button>
                    )
                  }
                </div>
              </div>
            ) : (
              this.state.module.name ? (
                <div className="submodule-section col-1">
                  <div className="row center">
                    <h3>Main</h3>
                  </div>
                  <p>{ this.state.module.subitems[0].description }</p>
                  <div className="row center">
                    {
                      event[this.state.module.value] ? (
                        <button onClick={() => { this.deleteModule() }}>Delete</button>
                      ) : (
                        <button onClick={() => { this.createModule() }}>Create</button>
                      )
                    }
                  </div>
                </div>
              ) : (
                ""
              )
            )
          }
        </div>
      </div>
    )
  }
}
