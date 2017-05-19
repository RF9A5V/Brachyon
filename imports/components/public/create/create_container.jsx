import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

import SubContainer from "./sub_create_container.jsx";
import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";
import CreateContainerMenu from "./create_side_menu.jsx";

export default class CreateContainer extends ResponsiveComponent {

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
      },
      open: false
    };
  }

  componentWillReceiveProps(next) {
    const index = next.items.findIndex(o => {
      return o.key == this.props.items[this.state.selected].key
    })
    this.setState({
      selected: index || 0
    });
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

  renderBase(opts) {
    return (
      <div className="col x-center col-1" style={{
        padding: 20,
        paddingBottom: opts.mobile ? 146 : 20,
        width: "100%",
        maxWidth: this.props.stretch ? "100%" : 1000,
        margin: "0 auto",
        backgroundColor: "#444",
        minHeight: "calc(100vh - 90px)",
        boxShadow: "0 5px 5px #111"}}
      >
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
        {
          opts.navComp
        }
        <div style={{marginBottom: 10, width: "100%"}}>
          {
            this.props.items.map((item, i) => {
              return (
                <div style={{width: opts.mobile ? "calc(90vw - 40px)" : "100%", marginLeft: opts.mobile ? ("calc(10vw + 10px)") : 0}}>
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
        <div className={`row x-center footer-buttons footer-bar ${opts.mobile ? "mobile" : ""}`}>
          {
            (this.props.actions || []).map((a, i) => {
              const shouldShowText = (opts.mobile && this.props.actions.length <= 2) || !opts.mobile;
              return (
                <div className={`row x-center center create-container-option foot-button col-1 ${opts.eColor == "#FF6000" ? "orange" : "blue"} noselect`} style={{fontWeight: "bold"}} onClick={a.action}>
                  <FontAwesome name={a.icon} style={{fontSize: opts.fontSize, marginRight: shouldShowText ? 10 : 0}} />
                  {
                    shouldShowText ? (
                      <span style={{fontSize: opts.fontSize}}>{ a.name.toUpperCase() }</span>
                    ) : (
                      null
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

  renderDesktop() {
    var eColor;
    if(window.location.pathname.indexOf("event") >= 0){
      eColor = "#00BDFF";
    }
    else if(window.location.pathname.indexOf("league" >= 0)){
      eColor = "#FF6000";
    }

    var style = {
      margin: "0px auto 10px",
      width: "100%"
    }

    if(!this.props.stretch) {
      style.maxWidth = "1000px";
    }

    const navComp = (
      <div className="" style={style}>
        <div className="row">
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
                  <FontAwesome name={item.icon} style={{marginRight: 10, color: this.state.selected == i ? eColor : "white", fontSize: "1.5em"}} />
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
      </div>
    )
    return this.renderBase({
      navComp,
      eColor,
      fontSize: "1em",
      mobile: false
    });
  }

  renderMobile() {
    var eColor;
    if(window.location.pathname.indexOf("event") >= 0){
      eColor = "#00BDFF";
    }
    else if(window.location.pathname.indexOf("league" >= 0)){
      eColor = "#FF6000";
    }
    const navComp = (
      <CreateContainerMenu
        ref="menu"
        items={this.props.items}
        toggle={this.defaultToggleAction.bind(this)}
        modStatus={this.state.modStatus}
        onItemSelect={(i) => {
          this.setState({
            selected: i
          })
        }}
        selected={this.state.selected}
        actions={this.props.actions}
      />
    )
    return this.renderBase({
      navComp,
      eColor,
      fontSize: "4rem",
      mobile: true
    });
  }

}
