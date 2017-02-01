import React, { Component } from "react";

import Editor from "/imports/components/public/editor.jsx";
import ImageForm from "/imports/components/public/img_form.jsx";
import LocationForm from "/imports/components/events/create/location_select.jsx";

export default class DetailsPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      option: 0,
      titleLength: 0
    };
  }

  componentWillReceiveProps(next) {
    console.log(next.attrs.details);
    this.setState({
      titleLength: next.attrs.details.name.length
    })
  }

  componentWillUnmount() {
    if(this.refs.image && this.refs.image.hasValue()) {
      this.props.attrs.details.image = {
        file: this.state.cache,
        meta: this.refs.image.dimensions()
      }
    }
  }

  categories() {
    var options = ["Title", "Description", "Location", "Image"];
    if(window.location.pathname == "/events/create"){
      var eColor = "#00BDFF";
    }
    else if(window.location.pathname == "/leagues/create"){
      var eColor = "#FF6000";
    }
    else{}
    return options.map((val, i) => {
      var style = {
        backgroundColor: "#111",
        padding: 10,
        color: this.state.option == i ? eColor : "#FFF",
        width: 100,
        marginRight: 10,
        textAlign: "center",
        cursor: "pointer"
      }
      return (
        <div style={style} onClick={() => {
          if(this.state.cache && this.refs.image && this.refs.image.hasValue()) {
            this.props.attrs.details.image = {
              file: this.state.cache,
              meta: this.refs.image.dimensions()
            }
          }
          this.setState({ option: i })
        }}>
          { val }
        </div>
      )
    })
  }

  forms() {
    if(this.state.option == 0) {
      return (
        <div className="row" style={{marginTop: 10}}>
          <div className="col col-2" style={{marginRight: 20}}>
            <div className="row x-center">
              <h5 style={{marginRight: 20}}>Event Title</h5>
              <span>{ (this.props.attrs.details.name || "").length } / 50</span>
            </div>
            <input type="text" defaultValue={this.props.attrs.details.name} onChange={(e) => {
              var value = e.target.value;
              if(value.length > 50) {
                e.target.value = value.substring(0, 50);
              }
              this.props.attrs.details.name = e.target.value;
              this.setState({
                titleLength: value.length
              });
            }} />
          </div>
          <div className="col col-1">
            <h5>Season</h5>
            <input type="text" defaultValue={this.props.attrs.details.season || 1} onChange={(e) => {
              this.props.attrs.details.season = e.target.value;
            }} />
          </div>
        </div>
      )
    }
    if(this.state.option == 1) {
      return (
        <Editor value={this.props.attrs.details.description} usePara={true} useInsert={true} useTable={true} onChange={(value) => {
          this.props.attrs.details.description = value;
        }} />
      )
    }
    if(this.state.option == 2) {
      return (
        <LocationForm {...this.props.attrs.details.location} onChange={(loc) => { this.props.attrs.details.location = loc; }} />
      )
    }
    if(this.state.option == 3) {
      console.log(this.props.attrs.details.image);
      return (
        <div className="row x-center">
          <ImageForm
            aspectRatio={16/9}
            defaultImage={(this.props.attrs.details.image || {}).file || this.state.cache}
            onImgSelected={(img) => { this.setState({ cache: img }) }}
            ref="image"
          />
        </div>
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
