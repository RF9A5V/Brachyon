import React, { Component } from "react";

export default class SelectContainer extends Component {



  changeVal(e)
  {
    console.log(e.target.value);
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
    console.log(this.props.max);
    var percentarray = [];
    for (var x = this.props.max-1; x >= 0; x--)
    {
      var z = (x+1)*5;
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
