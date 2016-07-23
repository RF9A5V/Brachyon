import React, { Component } from 'react'

export default class MatchBlock extends Component {

  constructor(props) {
    super(props);

    var id2, id3, round, strid, strid2;
    if (this.props.sp2%2 == 0)
      id2 = this.props.sp2+1;
    else
      id2 = this.props.sp2-1;
    id3 = Math.floor(this.props.sp2/2);
    round = this.props.pos;
    if (this.props.pos > -1)
    {
      strid = "match" + id2 + "round" + this.props.pos;
    }
    else
    {
      strid = "match" + id2 + "nonbye";
      round+=2;
    }
    strid2 = "match" + id3 + "round" + (round+1);

    if (this.props.sty.color == "gray")
      this.state = {clickable: false, val: this.props.sp, opponent: strid, successor: strid2, loss: false, win: false}
    else
      this.state = {clickable: true, val: this.props.sp, opponent: strid, successor: strid2, loss: false, win: false}
  }

  advance()
  {
    if (document.getElementById(this.props.eid).style.color == "white" && document.getElementById(this.state.opponent).style.color == "white")
    {
      document.getElementById(this.state.opponent).style.color = "red";
      document.getElementById(this.props.eid).style.color = "gray";
      document.getElementById(this.state.successor).innerHTML += " " + this.state.val;
      Meteor.call("bot.informOnUpdate", `${this.state.val} advances to match ${this.state.successor}. Good for you. Scrub.`);
      this.props.changematches(this.props.eid, this.state.opponent, this.state.successor, this.state.val) //Passing in its own ref, its opponents ref, and its successors ref.
    }
  }

  cwait()
  {
    this.setState({clickable: false})
    document.getElementById(this.props.eid).style.color = "gray";
  }

  cwin()
  {
    document.getElementById(this.props.eid).style.color = "green";
    this.setState({clickable: false, win: true});
  }

  closs()
  {
    document.getElementById(this.props.eid).style.color = "red";
    this.setState({clickable: false, loss: true});
  }

  ctrue()
  {
    this.setState({clickable: true});
    document.getElementById(this.props.eid).style.color = "white";
  }

  gopponent()
  {
    return this.state.opponent;
  }



  cval(val)
  {
    this.setState({val: val});
  }

  render()
  {
    var string;
    if (this.props.sp == "")
      this.props.sty.color = "gray";
    if (this.props.pos == -1)
      string = "Nonbye ";
    else
      string = "Box ";
    return(
      <div className="tbox" id={this.props.eid} style = {this.props.sty} onClick={this.advance.bind(this)}>
        {string+this.props.sp}
      </div>
    )
  }
}
