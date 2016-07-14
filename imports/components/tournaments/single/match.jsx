import React, { Component } from 'react'

export default class MatchBlock extends Component {

  render()
  {
    var string;
    if (this.props.bye == 0)
      string = "Nonbye ";
    else
      string = "Box ";
    return(
      <div className="tbox" id={this.props.bid} style = {this.props.sty}>
        {string+this.props.sp}
      </div>
    )
  }
}
