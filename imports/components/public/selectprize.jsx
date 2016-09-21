import React, { Component } from "react";

export default class SelectContainer extends Component {



  changeVal(e)
  {
    e.preventDefault();
    var val = e.target.value;
    var num = this.props.num;
    if (this.props.num == 4)
    {
      val /= 4;
    }
    if (this.props.num == 5)
    {
      val /= 8;
      num = 8;
    }
    this.props.changePercent(num, this.props.br, val);
  }

  getOrdinal(n) {
     var s=["th","st","nd","rd"],
         v=n%100;
     return n+(s[(v-20)%10]||s[v]||s[0]);
  }

  render()
  {
    var percentarray = [];
    var min = this.props.num>3 ? (this.props.min/Math.pow(2, this.props.num-3)):(this.props.min);
    var minimum = Math.ceil(20 / min);
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
    if (this.props.num < 4)
      var string = this.getOrdinal(this.props.num+1) + " Place Split: ";
    else
    {
      var n = (this.props.num == 4) ? (4):(8);
      var string = this.getOrdinal(n+1) + " to " + this.getOrdinal(n*2) + " range: ";
    }
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
