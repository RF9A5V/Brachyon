import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import SubContainer from "./sub_create_container.jsx";

export default class CreateContainer extends Component {

  constructor(props) {
    super(props);
    var modStatus = {};
    props.items.forEach(item => {
      if(item.toggle) {
        modStatus[item.key] = item.initialToggleState || false;
      }
    })
    this.state = {
      selected: 0,
      modStatus,
      creator: {
        type: "user",
        id: Meteor.userId()
      }
    };
  }

  value() {
    var obj = {};
    this.props.items.forEach((item, i) => {
      if(item.toggle && !this.state.modStatus[item.key]) {
        return null;
      }
      var subObj = this.refs[item.key].value();
      if(subObj[item.key]) {
        obj[item.key] = subObj[item.key];
      }
      else {
        obj[item.key] = subObj;
      }
    });
    obj.creator = this.state.creator;
    return obj;
  }

  _getRefValue(key, subKey) {
    if(subKey) {
      return this.refs[key].refs[subKey].value();
    }
    return this.refs[key].value();
  }

  defaultToggleAction(item) {
    if(item.toggleAction) {
      item.toggleAction();
    }
    this.state.modStatus[item.key] = !this.state.modStatus[item.key];
    this.forceUpdate();
  }

  render() {
    var eColor;
    if(window.location.pathname.indexOf("event") >= 0){
      eColor = "#00BDFF";
    }
    else if(window.location.pathname.indexOf("league" >= 0)){
      eColor = "#FF6000";
    }
    return (
      <div className="col col-1">
        <div className="row" style={{justifyContent: "flex-end"}}>
          {
            Organizations.find().fetch().length > 0 ? (
              <div className="col" style={{padding: 10, backgroundColor: "#666", cursor: "pointer"}}>
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
            ) : (
              ""
            )
          }
        </div>
        <div className="row" style={{marginBottom: 10}}>
          {
            this.props.items.map((item, i) => {
              return (
                <div onClick={() => { this.setState({selected: i}) }} key={item.name + i} className="row x-center" style={{
                  padding: 10,
                  backgroundColor: this.state.selected == i ? "#111" : "#666",
                  marginRight: 10,
                  width: 175,
                  cursor: "pointer"
                }}>
                  <FontAwesome name={item.icon} style={{marginRight: 10, color: this.state.selected == i ? eColor : "white"}} size="2x" />
                  <span className="title">{ item.name }</span>
                  <div className="col-1"></div>
                  {
                    item.toggle ? (
                      <div className="col mod-block-toggle" style={{justifyContent: this.state.modStatus[item.key] ? "flex-start" : "flex-end"}} onClick={() => { this.defaultToggleAction(item) }}>
                        <div className="mod-block-control" style={{backgroundColor: this.state.modStatus[item.key] ? eColor : "white"}}></div>
                      </div>
                    ) : (
                      null
                    )
                  }
                </div>
              )
            })
          }
        </div>
        <div>
          {
            this.props.items.map((item, i) => {
              return (
                <div style={{width: "100%"}}>
                  <SubContainer key={item.key} ref={item.key} items={item.subItems} active={i == this.state.selected} update={this.setState.bind(this)} status={this.state.modStatus[item.key]} setStatus={(val) => {
                    if(this.state.modStatus[item.key] === undefined) {
                      return;
                    }
                    this.state.modStatus[item.key] = val;
                    this.forceUpdate();
                  }} getRefValue={this._getRefValue.bind(this)} />
                </div>
              )
            })
          }
        </div>
        <div className="row x-center" style={{width: "100vw", height: 50, position: "fixed", backgroundColor: "#111", bottom: 0, left: 0, right: 0}}>
          {
            (this.props.actions || []).map((a, i) => {
              return (
                <div className="create-container-option" onClick={a.action}>
                  { a.name }
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}
