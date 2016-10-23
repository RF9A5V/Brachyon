import React, { Component } from "react";

export default class SelectContainer extends Component {



  changeVal(e)
  {
    e.preventDefault();
    var val = e.target.value;
    var vcount;
    if (this.props.num == 4) {
      vcount = e.target.value%4;
      for (var x = 4; x < 8; x++)
      {
        if (vcount > 0)
          this.props.changePercent(x, this.props.br, Math.ceil(val/4));
        else
          this.props.changePercent(x, this.props.br, Math.floor(val/4));
        vcount--;
      }
    }
    else if (this.props.num == 5)
    {
      vcount = e.target.value%8;
      for (var x = 8; x < 15; x++)
      {
        if (vcount > 0)
          this.props.changePercent(x, this.props.br, Math.ceil(val/8));
        else
          this.props.changePercent(x, this.props.br, Math.floor(val/8));
        vcount--;
      }
    }
    else
    {
      this.props.changePercent(this.props.num, this.props.br, val);
    }
  }

  getOrdinal(n) {
    // Damn son.
     var s=["th","st","nd","rd"],
         v=n%100;
     return n+(s[(v-20)%10]||s[v]||s[0]);
  }

  render()
  {
    var percentarray = [];
    var min = this.props.min;
    var minimum = Math.ceil(20 / min);
    if (this.props.max < minimum)
      minimum = this.props.max;
    if (this.props.val < minimum)
      minimum = this.props.val;
    if (this.props.num > 3)
      minimum = 1;
    for (var x = this.props.max; x >= minimum; x--)
    {
      var z = (x)*5;
      var y = z + "%";
      percentarray.push(y);
    }
    if (this.props.num < 4)
      var string = this.getOrdinal(this.props.num+1);
    else
    {
      var n = (this.props.num == 4) ? (4):(8);
      var string = this.getOrdinal(n+1) + " to " + this.getOrdinal(n*2);
    }
    return(
      <div className="row x-center flex-pad" style={{marginTop: 10}}>
        <span>{string}</span>
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
