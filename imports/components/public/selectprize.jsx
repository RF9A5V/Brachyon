import React, { Component } from "react";

export default class SelectContainer extends Component {

  constructor(props)
  {
    super(props);
    this.state = {
      value: this.refs.num
    }
  }

  changePercent(e)
  {
    e.preventDefault();
    this.refs.changePercent(e.target.value);
  }

  render()
  {
    percentarray = [];
    for (var x = 0; x < (this.refs.num+1)*5; x++)
    {
      var y = x + "%";
      percentarray.push(y);
    }
    return(
      <div>
        <select onChange={this.changePercent().bind(this)} value={this.refs.val}>
        {
          percentarray.map(percent, i) => {
            ( <option value={i}>{percent}</option> )
          }
        }
        </select>
      </div>
    );
  }
}
