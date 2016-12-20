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
        <div className="col" style={{marginTop: 10}}>
          <div className="row x-center">
            <h5 style={{marginRight: 20}}>Event Title</h5>
            <span>{ this.state.titleLength } / 50</span>
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
      return (
        <div className="row x-center">
          <ImageForm
            aspectRatio={16/9}
            defaultImage={(this.props.attrs.details.image || {}).file || this.state.cache}
            onImgSelected={(img) => { this.setState({ cache: img }) }}
            onCrop={(url, dims) => { this.setState({ preview: url })} }
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
