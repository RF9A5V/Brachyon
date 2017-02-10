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
      obj[item.key] = this.refs[i].value();
    });
    return obj;
  }

  render() {
    var style = { padding: 20, backgroundColor: "#666" };
    if(!this.props.active) {
      style.height = 0;
      style.overflowY = "hidden";
      style.padding = 0;
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
                    <div style={{padding: 10, textAlign: "center", width: 100, backgroundColor: "#111", marginRight: 10, color: this.state.selected == i ? "#00BDFF" : "white"}} onClick={() => {this.setState({selected: i})}}>
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
                  <item.content ref={i} {...item.args} status={this.props.status} setStatus={this.props.setStatus} />
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}
