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
      labels = (event.organize || []).map(function() {
        return [
          {
            name: "First Place",
            start: 0
          }
        ]
      })
    }

    selectvalues=[];

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

  checkSelects(num, val) {
    var narr = this.state.selarr;
    var nmarr = this.state.valarr;
    if (val > narr[num])
    {
      var extra = val - nmarr[num];
      while (extra)
      {
        if (narr[narr.length-1] <= extra)
        {
          extra -= narr[narr.length-1];
          narr.pop();
        }
        else
        {
          narr[narr.length-1] -= extra;
          extra = 0;
        }
      }
    }
    var sum = narr.reduce(function(a, b){return a + b}, 0);

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
                <h3>{ bracket.name }</h3>
                <div className="col">
                  <SelectContainer />
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}
