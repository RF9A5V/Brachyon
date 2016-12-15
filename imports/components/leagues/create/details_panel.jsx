import React, { Component } from "react";

import Editor from "/imports/components/public/editor.jsx";

export default class DetailsPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      option: 0,
      titleLength: 0
    };
  }

  categories() {
    var options = ["Title", "Description"];
    return options.map((val, i) => {
      var style = {
        backgroundColor: "#111",
        padding: 10,
        color: this.state.option == i ? "#00BDFF" : "#FFF",
        width: 100,
        marginRight: 10,
        textAlign: "center",
        cursor: "pointer"
      }
      return (
        <div style={style} onClick={() => { this.setState({ option: i }) }}>
          { val }
        </div>
      )
    })
  }

  forms() {
    if(this.state.option == 0) {
      return (
        <div className="col" style={{marginTop: 10}}>
          <div className="row x-center">
            <h5 style={{marginRight: 20}}>Event Title</h5>
            <span>{ this.state.titleLength } / 50</span>
          </div>
          <input type="text" onChange={(e) => {
            var value = e.target.value;
            if(value.length > 50) {
              e.target.value = value.substring(0, 50);
            }
            this.setState({
              titleLength: value.length
            });
            this.props.setValue("details", "name", e.target.value);
          }} />
        </div>
      )
    }
    if(this.state.option == 1) {
      return (
        <Editor usePara={true} useInsert={true} useTable={true} onChange={(value) => {
          this.props.setValue("details", "description", value);
        }} />
      )
    }
  }

  render() {
    return (
      <div>
        <div className="row">
          {
            this.categories()
          }
        </div>
        <div style={{marginTop: 10}}>
          { this.forms() }
        </div>
      </div>
    )
  }
}
