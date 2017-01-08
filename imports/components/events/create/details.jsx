import React, { Component } from 'react';
import moment from "moment";

import LocationSelect from './location_select.jsx';
import DateInput from './date_input.jsx';
import TimeInput from './time_input.jsx';
import ImageForm from "../../public/img_form.jsx";
import Editor from "../../public/editor.jsx";

import { Banners } from "/imports/api/event/banners.js";

export default class DetailsPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      option: "Title",
      content: ""
    }
  }

  onTitleChange() {
    var text = this.refs.name.value;
    if(text.length > 50) {
      this.refs.name.value = text.substring(0, 50);
    }
    this.props.attrs.details.name = this.refs.name.value;
    this.forceUpdate();
  }

  setImage(base64) {
    this.setState({
      image: base64
    });
    this.props.attrs.details.image = {
      file: this.state.image,
      meta: this.refs.image.dimensions()
    }
  }

  currentComponent() {
    var item = (
      <div></div>
    );
    switch(this.state.option) {
      case "Title":
        item = (
          <div className="col">
            <div className="row x-center">
              <h5 style={{marginRight: 10}}>Event Name</h5>
              <span style={{fontSize: 12}}>{(this.props.attrs.details.name || "").length} / 50</span>
            </div>
            <input type="text" placeholder="Something Catchy..." ref="name" onChange={this.onTitleChange.bind(this)} defaultValue={this.props.attrs.details.name} />
          </div>
        );
        break;
      case "Location":
        item = (
          <div className="col">
            <LocationSelect ref="location" online={false} onChange={(location) => { this.props.attrs.details.location = location; }} {...this.props.attrs.details.location} />
          </div>
        )
        break;
      case "Description":
        item = (
          <div className="col" style={{marginBottom: 20}}>
            <Editor onChange={(content) => { this.props.attrs.details.description = content; }} useInsert={true} usePara={true} useTable={true} value={this.props.attrs.details.description} />
          </div>
        )
        break;
      case "Time":
        item = (
          <div className="row col-2" style={{marginBottom: 20}}>
            <div className="col-1 x-center center">
              <h5 style={{marginBottom: 10}}>Date</h5>
              <div>
                <DateInput ref="date" onChange={(date) => {
                  this.props.attrs.details.date = date;
                }} init={this.props.attrs.details.date} />
              </div>
            </div>
            <div className="col-1 col x-center">
              <h5 style={{marginBottom: 10}}>Time</h5>
              <div className="row center x-center col-1" style={{marginBottom: 4, padding: "0 15px", border: "2px solid white", backgroundColor: "#333"}}>
                <TimeInput ref="time" onChange={(time) => { this.props.attrs.details.time = time; }} init={this.props.attrs.details.time} />
              </div>
            </div>
          </div>
        )
        break;
      case "Banner":
        item = (
          <div>
            <h5>Event Image (Optional)</h5>
            <div className="row center">
            <ImageForm
              ref="image"
              aspectRatio={16/9}
              onImgSelected={this.setImage.bind(this)}
              defaultImage={(this.props.attrs.details.image || {}).file || this.state.image}
            />
            </div>
          </div>
        )
        break;
      default:
        break;
    }
    return item;
  }

  render() {
    var options = ["Title", "Location", "Description", "Time", "Banner"]
    return (
      <div>
        <div className="row" style={{marginBottom: 20}}>
          {
            options.map(op => {
              var optionStyle = {
                padding: 10,
                marginRight: 10,
                width: 100,
                color: this.state.option == op ? "#0BDDFF" : "white",
                backgroundColor: "#111",
                cursor: "pointer"
              }
              return (
                <div className="row x-center center" style={optionStyle} onClick={() => { this.setState({ option: op }) }}>{op}</div>
              )
            })
          }
        </div>
        {
          this.currentComponent()
        }
      </div>
    )
  }
}
