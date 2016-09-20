import React, { Component } from "react";

export default class SelectContainer extends Component {



  changeVal(e)
  {
    e.preventDefault();
    this.props.changePercent(this.props.num, this.props.br, e.target.value);
  }

  getOrdinal(n) {
     var s=["th","st","nd","rd"],
         v=n%100;
     return n+(s[(v-20)%10]||s[v]||s[0]);
  }

  render()
  {
    var percentarray = [];
    var minimum = Math.ceil(20 / this.props.min);
    if (this.props.max < minimum)
      minimum = this.props.max;
    if (this.props.val < minimum)
        minimum = this.props.val;
    for (var x = this.props.max; x >= minimum; x--)
    {
      var z = (x)*5;
      var y = z + "%";
      percentarray.push(y);
    }
    var string = this.getOrdinal(this.props.num+1) + " Place Split: ";
    return(
      <div className="row">
        <span style={{paddingTop: "3px"}}>{string}</span>
        <select onChange={this.changeVal.bind(this)} value={this.props.val}>
        {
          percentarray.map((percent, i) => {
            return ( <option value={this.props.max-i}>{percent}</option> )
          })
        }
        </select>
      </div>
    );
  }
}
