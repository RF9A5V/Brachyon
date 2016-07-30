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
    if (this.props.bset)
      id3 = this.props.sp2%2 == 0 ? id2:this.props.sp2;
    round = this.props.pos;
    str = "", losdiv = 1;
    if (this.props.loss)
    {
      str = "los";
      losdiv = 2;
      lb = true;
    }
    if (this.props.pos > -1)
    {
      strid = "match" + id2 + "round" + str + this.props.pos;
    }
    else
    {
      strid = "match" + id2 + "nonbye" + str;
      round+=2;
    }
    strid2 = "match" + id3 + "round" + str + (round+1);
    if (this.props.twoset)
    {
      strid = "match" + id2 + "nonbye2los";
      strid2 = "match" + id3 + "nonbyelos";
    }
    if (this.props.sty.color == "gray")
      this.state = {clickable: false, val: this.props.sp, opponent: strid, successor: strid2, loss: false, win: false, round: round, opmat: id2, succmat: id3}
    else
      this.state = {clickable: true, val: this.props.sp, opponent: strid, successor: strid2, loss: false, win: false, round: round, opmat: id2, succmat: id3}
  }

  advance()
  {
    if (document.getElementById(this.props.eid).style.color == "white" && document.getElementById(this.state.opponent).style.color == "white")
    {
      document.getElementById(this.state.opponent).style.color = "red";
      document.getElementById(this.props.eid).style.color = "gray";
      this.props.changematches(this.props.eid, this.state.opponent, this.state.successor, this.state.val) //Passing in its own ref, its opponents ref, and its successors ref.
    }
    console.log(this.props.eid);
    console.log(this.state.opponent);
    console.log(this.state.successor);
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

  gval()
  {
    return this.state.val;
  }

  gmatch()
  {
    return this.props.sp2;
  }

  gopmatch()
  {
    return this.state.opmat;
  }

  gsuccmat() //succ
  {
    return this.state.succmat; //Levels of irony we have never attained
  }

  ground()
  {
    return this.state.round;
  }

  glb()
  {
    return this.props.loss;
  }

  cval(val)
  {
    document.getElementById(this.props.eid).innerHTML += " " + val;
    this.setState({val: val});
  }

  setloser(loser)
  {
    this.setState({loss: loser});
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
