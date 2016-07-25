import React, { Component } from 'react'
import MatchBlock from './match.jsx';

export default class DoubleDisplay extends Component {

  flatten(ary) {
      var ret = [];
      for(var i = 0; i < ary.length; i++) {
          if(Array.isArray(ary[i])) {
              ret = ret.concat(this.flatten(ary[i]));
          } else {
              ret.push(ary[i]);
          }
      }
      return ret;
  }

  seed(array) {
    while (array.length > 1)
    {
      narr = Array(array.length/2);
      for (i = 0; i < array.length/2; i++)
        narr[i] = [array[i], array[array.length-i-1]];
      array = narr;
    }
    array = this.flatten(array);
    return array;
  }

  formbrackets() {
    var num = 16, matchn = 1, i, spacing = 0, m=0, n=0;
    var nonbyes = (num - Math.pow(2, Math.floor(Math.log2(num))))*2;
    var byes = num - nonbyes;
    var rounds = Math.ceil(Math.log2(num));
    var boxes = [], usedspots = [], spot = []

    //This will determine the spacing and placement for the nonbyes.
    var roundparticipants = num - nonbyes/2, losers = roundparticipants/2;
    if (nonbyes > 0)
    {
      var nbarr = Array.apply(null, Array(roundparticipants*2)).map(function (_, i) {return i+1;});
      var aseed = this.seed(nbarr);
      matchn++;
      for (i = 0; i < nonbyes; i++)
        spot.push(aseed.indexOf(byes+i+1));
      spot = spot.sort(function(a, b){return a-b});
      for (i = 0; i < nonbyes; i++) //byes+i+1 is how we access the nonbye numbers.
      {
        var boxid = "match" + spot[i] + "nonbye";
        var style = {
          top: spot[i]*50 - 25 + "px",
          left: 200 + "px",
          color: "white"
        }
        boxes.push(
          <MatchBlock sty={style} eid={boxid} pos={-1} sp={byes+1+i} sp2={spot[i]} key={n} ref={boxid} changematches={this.changematches.bind(this)}/>
        )
        n++;
        usedspots[Math.floor(i/2)] = Math.floor((spot[i])/2);
      }
    }

    //This is primary function for the style and the actual placement of the byes.
    var str;
    while (matchn <= rounds+1)
    {
      var w = 1;
      for (i = 0; i < roundparticipants; i++)
      {
          var boxid = "match" + i + "round" + matchn;
          var style = {
            top: i*50*Math.pow(2,matchn-1)+spacing + "px",
            left: matchn*200 + "px",
            color: "white"
          };
          if (roundparticipants == (num - nonbyes/2) && (i == 0 || !(usedspots.includes(i))))
          {
            str = w;
            w++;
          }
          else
            str = "";
          boxes.push(
            <MatchBlock sty={style} eid={boxid} pos={matchn} sp={str} sp2 = {i} ref={boxid} changematches={this.changematches.bind(this)}/>
          )
      }
      if (spacing == 0)
      {
        var sty = {top: 2*i*50*Math.pow(2,matchn-1)+spacing + 300 + "px", position: "absolute", height: "95px", width: "30px"};
        boxes.push(<div style={sty} />);
      }
      spacing = spacing+Math.pow(2, matchn-1)*25;
      matchn++;
      roundparticipants = roundparticipants/2;
    }

    //Losers bracket
    var fmspot = spot;
    spot = []
    matchn = 1, bset = false, mult = 1, tpspace = 0;
    if ((losers*3) >= num)
    {
      bset = true;
    }
    console.log(losers);
    if (byes > 0)
    {
      nbarr = Array.apply(null, Array(losers*2)).map(function (_, i) {return i+1;});
      for (i = 0; i < nonbyes; i++)
        spot.push(aseed.indexOf(byes+i+1));
      spot = spot.sort(function(a, b){return a-b});
      for (i = 0; i < nonbyes; i++) //byes+i+1 is how we access the nonbye numbers.
      {
        var boxid = "match" + spot[i] + "nonbyelos";
        var style = {
          top: spot[i]*50 + losers*200 - 25 + "px",
          left: 200 + "px",
          color: "white"
        }
        boxes.push(
          <MatchBlock sty={style} eid={boxid} pos={-1} sp={""} sp2={spot[i]} key={n} ref={boxid} changematches={this.changematches.bind(this)}/>
        )
        n++;
      }
    }
    mleft = matchn;
    while (losers > .99)
    {
      for (i = 0; i < (losers); i++)
      {
        var boxid = "match" + i + "roundlos" + matchn;
        var style = {
          top: i*50*Math.pow(2,matchn-1)+300-tpspace+spacing + "px",
          left: mleft*200 + "px",
          color: "white"
        };
        boxes.push(
          <MatchBlock sty={style} eid={boxid} pos={matchn} sp={""} loss={true} sp2 = {i} ref={boxid} bset={bset} changematches={this.changematches.bind(this)}/>
        )
        n++;
      }
      if (bset && losers > 1)
      {
        bset = false;
        tpspace = tpspace + (50*Math.pow(2,matchn-1))/2
      }
      else
      {
        spacing = spacing+Math.pow(2, matchn-1)*25;
        bset = true;
        losers = losers/2;
        matchn++;
      }
      mleft++;
    }
    return boxes;
  }

  changematches(id1, id2, id3, val) //id1 is winner, id2 is loser, id3 is
  {
    this.refs[id1].cwin();
    this.refs[id2].closs();
    this.refs[id3].ctrue();
    this.refs[id3].cval(val);
  }

  render() {
    var boxes = this.formbrackets();
    return (
    <div>
      {boxes}
    </div>
    );
  }
}

/*
 function(id1, id2){
 return function(e) {
 e.preventDefault();
 // Make changes to box[id_1]
 // Make changes to box[id_2]
}
}
*/
