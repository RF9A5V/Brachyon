import React, { Component } from "react";

export default class SubContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0
    };
  }

  value() {
    var obj = {};
    this.props.items.forEach((item, i) => {
      obj[item.key] = this.refs[item.key].value();
    });
    return obj;
  }

  _getRefValue(key) {
    return this.refs[key].value();
  }

  render() {
    var style = { padding: 20, backgroundColor: "#666" };
    if(!this.props.active) {
      style.height = 0;
      style.overflowY = "hidden";
      style.padding = 0;
    }
    var selectedColor = "white";
    if(window.location.pathname == "/events/create"){
      selectedColor = "#00BDFF";
    }
    else if(window.location.pathname == "/leagues/create"){
      selectedColor = "#FF6000";
    }
    return (
      <div style={style}>
        {
          this.props.items.length < 2 ? (
            null
          ) : (
            <div className="row" style={{marginBottom: 10}}>
              {
                this.props.items.map((item, i) => {
                  return (
                    <div style={{padding: 10, textAlign: "center", width: 100, backgroundColor: "#111", marginRight: 10, color: this.state.selected == i ? selectedColor : "white", cursor: "pointer"}} onClick={() => {this.setState({selected: i})}}>
                      { item.name }
                    </div>
                  )
                })
              }
            </div>
          )
        }
        <div>
          {
            this.props.items.map((item, i) => {
              return (
                <div style={this.state.selected == i ? {} : { height: 0, overflowY: "hidden" }}>
                  <item.content ref={item.key} {...item.args} status={this.props.status} setStatus={this.props.setStatus} getRefValue={this.props.getRefValue} />
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}
