import React, { Component } from "react";

import SliderBars from "/imports/components/public/sliders.jsx";

export default class PrizePoolBreakdown extends Component {

  constructor(props) {
    super(props);
    this.state = {
      labels: [
        {
          name: "First Place",
          start: 0
        }
      ]
    }
  }

  onLabelCreate(e){
    e.preventDefault();

    if(this.refs.field.value == ""){
      return toastr.error("Label needs name.", "Error!");
    }
    if(this.refs.start.value == ""){
      return toastr.error("Label needs starting position.", "Error!");
    }
    var start = parseInt(this.refs.start.value);
    var end = this.refs.end.value;
    if(end == "") {
      end = undefined;
    }
    else {
      end = parseInt(end);
    }
    this.state.labels.push({
      name: this.refs.field.value,
      start,
      end,
      percentage: 0,
      position: 0
    });
    toastr.success("Added label to prize pools.", "Success!");
    this.forceUpdate();
  }

  render() {
    var event = Events.findOne();
    if(!event.organize || event.organize.length == 0) {
      return (
        <div>
          <h3>To access prize pool functionality, you need to have at least one <b>bracket</b> in the <b>Organize</b> module.</h3>
        </div>
      )
    }
    return (
      <div>
        {
          event.organize.map((bracket, i) => {
            return (
              <div className="col" key={i}>
                <div className="col">
                  <label>Need vocab</label>
                  <input type="text" ref="field" style={{margin: 0}} />
                  <label>Placement</label>
                  <div className="row">
                    <input style={{margin: 0, marginRight: 10}} ref="start" />
                    <input ref="end" style={{margin: 0}} />
                  </div>
                  <div>
                    <button onClick={this.onLabelCreate.bind(this)}>Add a Label</button>
                  </div>
                </div>
                <SliderBars labels={this.state.labels} />

              </div>
            )
          })
        }
      </div>
    )
  }
}
