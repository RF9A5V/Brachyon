import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import SubContainer from "./sub_create_container.jsx";

export default class CreateContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: 0
    };
  }

  value() {
    var obj = {};
    this.props.items.forEach((item, i) => {
      obj[item.key] = this.refs[i].value();
    })
    return obj;
  }

  render() {
    return (
      <div>
        <div className="row" style={{marginBottom: 10}}>
          {
            this.props.items.map((item, i) => {
              return (
                <div onClick={() => { this.setState({selected: i}) }} key={item.name + i} className="row x-center" style={{
                  padding: 10,
                  backgroundColor: this.state.selected == i ? "#111" : "#666",
                  marginRight: 10,
                  width: 175
                }}>
                  <FontAwesome name={item.icon} style={{marginRight: 10}} size="2x" />
                  <span>{ item.name }</span>
                  <div className="col-1"></div>
                  {
                    item.toggle ? (
                      null
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
                  <SubContainer key={i} ref={i} items={item.subItems} active={i == this.state.selected} attrs={this.state.attrs} update={this.setState.bind(this)} />
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}
