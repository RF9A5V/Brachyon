import React, { Component } from 'react'
import MatchBlock from './match.jsx';

export default class SingleDisplay extends Component {

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
    if (array.length > 1)
    {
      var narr = Array(array.length/2)
      for (i = 0; i < array.length/2; i++)
        narr[i] = [array[i], array[array.length-i-1]];
      array = this.seed(narr);
    }
    else {
      array = this.flatten(array);
    }
    return array;
  }

  formbrackets() {
    var num = 10, matchn = 1, i, spacing = 0, m=0, n=0;
    var nonbyes = (num - Math.pow(2, Math.floor(Math.log2(num))))*2;
    var byes = num - nonbyes;
    var rounds = Math.ceil(Math.log2(num));
    var boxes = [], usedspots = []

    //This will determine the spacing and placement for the nonbyes.
    var roundparticipants = num - nonbyes/2;
    if (nonbyes > 0)
    {
      var nbarr = Array.apply(null, Array(roundparticipants*2)).map(function (_, i) {return i+1;});
      var aseed = this.seed(nbarr);
      spot = [];
      matchn++;
      for (i = 0; i < nonbyes; i++)
        spot.push(aseed.indexOf(byes+i+1));
      spot = spot.sort(function(a, b){return a-b});
      console.log(spot);
      for (i = 0; i < nonbyes; i++) //byes+i+1 is how we access the nonbye numbers.
      {
        var boxid = "match" + spot[i] + "nonbye";
        var style = {
          top: spot[i]*50 - 25 + "px",
          left: 200 + "px",
          color: "white"
        }
        boxes.push(
          <MatchBlock sty={style} eid={boxid} pos={-1} sp={byes+1+i} sp2 = {spot[i]} key={n} ref={boxid} changematches={this.changematches.bind(this)}/>
        )
        n++;
        usedspots[Math.floor(i/2)] = Math.floor((spot[i])/2);
      }
    }

    //This is primary function for the style and the actual placement of the byes.
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
            boxes.push(
              <MatchBlock sty={style} eid={boxid} pos={matchn} sp={w} sp2 = {i} ref={boxid} changematches={this.changematches.bind(this)}/>
            )
            w++;
          }
          else
          {
            boxes.push(
              <MatchBlock sty={style} eid={boxid} pos={matchn} sp={""} sp2 = {i} ref={boxid} changematches={this.changematches.bind(this)}/>
            )
          }
      }
        if (spacing == 0)
        {
          var sty = {top: i*50*Math.pow(2,matchn-1)+spacing + "px", position: "absolute", height: "95px", width: "30px"};
          boxes.push(<div style={sty} />);
        }
        spacing = spacing+Math.pow(2, matchn-1)*25;
        matchn++;
        roundparticipants = roundparticipants/2;
    }

    return boxes;
  }

  changematches(id1, id2, id3, val)
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
