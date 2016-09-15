import React, { Component } from "react";

import SliderBars from "/imports/components/public/sliders.jsx";
import SelectContainer from "/imports/components/public/selectprize.jsx"

export default class PrizePoolBreakdown extends Component {

  constructor(props) {
    super(props);
    var event = Events.findOne();
    // var labels = [];
    // if(event.revenue.prizePool != null) {
    //   labels = event.revenue.prizePool;
    // }
    // else {
    //   labels = (event.brackets || []).map(function() {
    //     return [
    //       {
    //         name: "First Place",
    //         start: 0
    //       }
    //     ]
    //   })
    // }
    var brarray = [];
    if (event.revenue.prizesplit != null)
      brarray = event.revenue.prizesplit;

    for (x = brarray.length; x < event.brackets.length; x++)
    {
      var selectvalues=[20];
      var maxvalues=[20];
      var newobj = {
            selarr: selectvalues,
            maxarr: maxvalues
          }
      brarray.push(newobj);
    }
    while (brarray.length > event.brackets.length)
      brarray.pop();


    this.state = {
      brarr: brarray,
      id: event._id
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

  onPrizeSplitSave(){
    Meteor.call("events.revenue.savePrize", this.state.id, this.state.brarr, (err) => {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully updated prize pool.", "Success!");
      }
    })
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

  checkSelects(num, br, val) {
    val = parseInt(val);
    var narr = this.state.brarr[br].selarr;
    if (val > narr[num])
    {
      var extra = val - narr[num];
      narr[num] = val;
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
    else if (val < narr[num])
    {
      var extra = narr[num] - val;
      narr[num] = val;
      for (var x = num+1; x < narr.length; x++)
      {
        if (narr[x] > val)
        {
          extra += (narr[x] - val);
          narr[x] = val;
        }
      }
      var newval = narr[narr.length-1];
      while (newval < extra)
      {
        narr.push(newval);
        extra -= newval;
      }
      if (extra > 0)
        narr.push(extra);
    }
    var sum = narr.reduce(function(a, b){return a + b}, 0);
    if (sum != 20)
    {
      Meteor.Error(404, "Incorrect placement percent");
      console.log(narr);
    }
    sum = 0;
    nmarr = [20];
    for (var x = 1; x < narr.length; x++)
    {
      sum += narr[x];
      nmarr.push( (20-sum) < (narr[x]) ? (20-sum):(narr[x]) );
    }
    var nbrarr = this.state.brarr;
    nbrarr[br].selarr = narr;
    nbrarr[br].maxarr = nmarr;
    this.setState({
      brarr: nbrarr
    });
  }

  render() {
    var event = Events.findOne();
    if(!event.brackets || event.brackets.length == 0) {
      return (
        <div>
          <h3>To access prize pool functionality, you need to have at least one <b>bracket</b> in the <b>Brackets</b> module.</h3>
        </div>
      )
    }
    console.log(this.state.brarr);
    return (
      <div>
        <div className="row flex-pad x-center">
          <span>Prize Pool Details</span>
          <button onClick={this.onPrizeSplitSave.bind(this)}>Save</button>
        </div>
        <div>
          {
            event.brackets.map((bracket, i) => {
              return (
                <div className="col" style={{marginBottom: 20}} key={i}>
                  <h3>{ bracket.name }</h3>
                  <h4>Choose Prize Pool Places:</h4>
                  <div className="col">
                  {
                    this.state.brarr[i].selarr.map((val, j) => {
                      return (<SelectContainer val = {val} num = {j} max = {this.state.brarr[i].maxarr[j]} br = {i} changePercent={this.checkSelects.bind(this)}/>)
                    })
                  }
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}
