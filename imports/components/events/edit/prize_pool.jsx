import React, { Component } from "react";

import SliderBars from "/imports/components/public/sliders.jsx";

export default class PrizePoolBreakdown extends Component {

  constructor(props) {
    super(props);
    var event = Events.findOne();
    var labels = [];
    if(event.revenue.prizePool != null) {
      labels = event.revenue.prizePool;
    }
    else {
      labels = event.organize.map(function() {
        return [
          {
            name: "First Place",
            start: 0
          }
        ]
      })
    }
    this.state = {
      labels
    }
  }

  onLabelCreate(index){
    return (e) => {
      e.preventDefault();

      if(this.refs["field" + index].value == ""){
        return toastr.error("Label needs name.", "Error!");
      }
      if(this.refs["start" + index].value == ""){
        return toastr.error("Label needs starting position.", "Error!");
      }
      var start = parseInt(this.refs["start" + index].value);
      var end = this.refs["end" + index].value;
      if(end == "") {
        end = undefined;
      }
      else {
        end = parseInt(end);
      }
      this.state.labels[index].push({
        name: this.refs["field" + index].value,
        start,
        end,
        percentage: 0,
        position: 0
      });
      toastr.success("Added label to prize pools.", "Success!");
      this.forceUpdate();
    }
  }

  value() {
    var values = {};
    var bracketCount = Events.findOne().organize.length;
    for(var i = 0; i < bracketCount; i ++) {
      values[i] = this.refs[i].values();
    }
    return values;
  }

  deleteLabel(bracketIndex) {
    return (index) => {
      return (e) => {
        this.state.labels[bracketIndex].splice(index, 1);
        this.forceUpdate();
      }
    }
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
              <div className="col" style={{marginBottom: 20}} key={i}>
                <h4>{ bracket.name }</h4>
                <div className="col">
                  <label>Need vocab</label>
                  <input type="text" ref={"field" + i} style={{margin: 0}} />
                  <label>Placement</label>
                  <div className="row">
                    <input style={{margin: 0, marginRight: 10}} ref={"start" + i} />
                    <input ref={"end" + i} style={{margin: 0}} />
                  </div>
                  <div>
                    <button onClick={this.onLabelCreate(i).bind(this)}>Add a Label</button>
                  </div>
                </div>
                <SliderBars labels={this.state.labels[i]} onRemove={this.deleteLabel(i).bind(this)} ref={i} />
              </div>
            )
          })
        }
      </div>
    )
  }
}
