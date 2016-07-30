import React, { Component } from 'react'
import MatchBlock from './match.jsx';

export default class DoubleDisplay extends Component {

  constructor(props)
  {
    super(props);
    loserarr = []
    this.state = {num: 16, loserarr: loserarr};
  }

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
    var num = this.state.num, matchn = 1, i, spacing = 0, m=0, n=0;
    var nonbyes = (num - Math.pow(2, Math.floor(Math.log2(num))))*2;
    var byes = num - nonbyes;
    var rounds = Math.ceil(Math.log2(num));
    var boxes = [], usedspots = [], spot = [], boxidarr = []
    var wintp, winl;
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
          <MatchBlock sty={style} eid={boxid} pos={-1} sp={byes+1+i} sp2={spot[i]} loss={false} key={n} ref={boxid} changematches={this.changematches.bind(this)}/>
        )
        boxidarr.push(boxid);
        n++;
        usedspots[Math.floor(i/2)] = Math.floor((spot[i])/2);
      }
    }

    //This is primary function for the style and the actual placement of the byes.
    var str;
    var fin = false;
    while (matchn <= rounds+1)
    {
      if (matchn == rounds+1)
        fin = true;
      var w = 1;
      for (i = 0; i < roundparticipants; i++)
      {
          var boxid = "match" + i + "round" + matchn;
          var style = {
            top: i*50*Math.pow(2,matchn-1)+spacing + "px",
            left: matchn*200 + "px",
            color: "white"
          };
          if (fin)
          {
            wintp = i*50*Math.pow(2,matchn-1)+spacing;
            winl = matchn*200;
          }
          if (roundparticipants == (num - nonbyes/2) && (i == 0 || !(usedspots.includes(i))))
          {
            str = w;
            w++;
          }
          else
            str = "";
        boxes.push(
          <MatchBlock sty={style} eid={boxid} pos={matchn} sp={str} sp2 = {i} loss={false} ref={boxid} changematches={this.changematches.bind(this)} final={fin}/>
        )
        boxidarr.push(boxid);
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
    spot = [];
    twobyeleft = 0;
    usedspots = [];
    matchn = 1, mleft = 1, bset = true, twoset = false, mult = 1, tpspace = 0, fin = false; //tpspace changes every second set of matches in the losers to be placed in the right spot
    if ((losers*3) < num)
    {
      for (i = 0; i < fmspot.length; i++)
      {
        if (Math.floor(fmspot[i]/2)%2 == 0)
        {
          fmspot.splice(i, 1);
            i--;
        }
      }
      nonbyes2 = (num-losers*3)*2;
      byes2 = losers-nonbyes2/2;
      nonbyes = nonbyes - nonbyes2;
      twoset = true;
      twobyeleft = 200;
    }
    byes = losers-nonbyes/2;
    loserarr = []
    usedbyes = []
    losernum = 0;
    loserarr[0] = [], loserarr[1] = []
    if (nonbyes > 0)
    {
      losernum+=2;
      var nbarr = Array.apply(null, Array(losers*2)).map(function (_, i) {return i+1;});
      var aseed = this.seed(nbarr);
      if (twoset)
      {
        for (i = 0; i < nonbyes2; i++)
          spot.push(aseed.indexOf(byes2+i+1));
        spot = spot.sort(function(a, b){return a-b});
        for (i = 0; i < nonbyes2; i++)
        {
          var boxid = "match" + (spot[i]+4) + "nonbye2los";
          var style = {
            top: (spot[i])*50*Math.pow(2,matchn-1)+300-tpspace+spacing + "px",
            left: 200 + "px",
            color: "white"
          }
          boxes.push(
            <MatchBlock sty={style} eid={boxid} pos={-1} sp={""} sp2={spot[i]+4} key={n} loss={true} twoset={true} ref={boxid} changematches={this.changematches.bind(this)}/>
          )
          usedbyes[Math.floor((spot[i]+4)/2)] = true;
          if (i%2 == 0) //Algorithm we're looking for: losers - spot[i]/4 gives us the challonge matching
          {
            loserarr[0][spot[i]+2] = boxid;
            loserarr[0][spot[i]+3] = boxid;
          }
          else
          {
            loserarr[0][spot[i]+3] = boxid;
            loserarr[0][spot[i]+4] = boxid;
          }
          n++;
        }
        spot = [];
      }
      for (i = 0; i < nonbyes; i++)
        spot.push(aseed.indexOf(byes+i+1));
      spot = spot.sort(function(a, b){return a-b});
      for (i = 0; i < nonbyes; i++) //byes+i+1 is how we access the nonbye numbers.
      {
        var boxid = "match" + spot[i] + "nonbyelos";
        var style = {
          top: spot[i]*50*Math.pow(2,matchn-1)+275-tpspace+spacing + "px",
          left: 200 + twobyeleft + "px",
          color: "white"
        }
        boxes.push(
          <MatchBlock sty={style} eid={boxid} pos={-1} sp={""} sp2={spot[i]} key={n} loss={true} ref={boxid} changematches={this.changematches.bind(this)}/>
        )
        usedspots[Math.floor(spot[i]/2)] = true;
        if (i%2 == 0) //Algorithm we're looking for: losers - spot[i]/4 gives us the challonge matching
        {
          loserarr[1][(losers - Math.floor(fmspot[i]/4))*2 - 2] = boxid;
          loserarr[1][(losers - Math.floor(fmspot[i]/4))*2 - 1] = boxid;
        }
        else if (!(usedbyes[i]))
        {
          loserarr[0][fmspot[i]] = boxid;
          loserarr[0][fmspot[i]-1] = boxid;
        }
        n++;
      }
      mleft++;
      matchn++;
    }

    rev = false;
    //Loser byes and onward
    winmat = 2;
    mat = losers;
    while (losers > .99)
    {
      if (losers == 1)
        fin = true;
      for (i = 0; i < (losers); i++)
      {
        var boxid = "match" + i + "roundlos" + mleft;
        var style = {
          top: i*50*Math.pow(2,matchn-1)+300-tpspace+spacing + "px",
          left: mleft*200 + twobyeleft + "px",
          color: "white"
        };
        boxes.push(
          <MatchBlock sty={style} eid={boxid} pos={mleft} sp={""} loss={true} sp2 = {i} ref={boxid} bset={bset} changematches={this.changematches.bind(this)} final={fin}/>
        )
        n++;
        if (nonbyes > 0 && mleft == 2)
        {
            mat = losers*2-i*2-2
            while (loserarr[1][mat])
              mat -= 2;
            if (!(usedspots[i]))
            {
              loserarr[1][mat] = boxid;
              loserarr[1][mat+1] = boxid;
            }
            if (i == losers-1)
              winmat++;
        }
        else if (mleft == 1)
        {
          rev = true;
          loserarr[0][i*2] = boxid;
          loserarr[0][i*2+1] = boxid;
        }
        else if (!bset)
        {
          if2 = losers > 2 ? 0:2
          if (!rev && i%2 == 0)
          {
            if (i < losers/2)
            {
              loserarr[winmat-1][losers/2 - i - 2 + if2] = boxid;
              loserarr[winmat-1][losers/2 - i - 1] = boxid;
            }
            else
            {
              loserarr[winmat-1][losers - i + losers/2 - 2] = boxid;
              loserarr[winmat-1][losers - i + losers/2 - 1] = boxid;
            }
          }
          else if (i%2 == 0)
          {
            if (i < losers/2)
            {
              loserarr[winmat-1][losers/2 + i] = boxid;
              loserarr[winmat-1][losers/2 + i+1 - if2] = boxid;
            }
            else {
              loserarr[winmat-1][i - losers/2] = boxid;
              loserarr[winmat-1][i+1 - losers/2] = boxid;
            }
          }
          else if (i == losers-1)
          {
            winmat++;
            rev = rev ? false:true;
          }
        }
      }
      if (bset && losers > 1)
      {
        bset = false;
        tpspace = tpspace + (50*Math.pow(2,matchn-1))/2;
      }
      else
      {
        spacing = spacing+Math.pow(2, matchn-1)*25;
        bset = true;
        losers = losers/2;
        matchn++;
      }
      loserarr[mleft] = [];
      mleft++;
    }
    var style = {top: wintp + 25 + "px", left: winl + 200 + "px", color: "white"};
    boxes.push(
      <MatchBlock sty={{top: wintp - 25 + "px", left: winl + 200 + "px", color: "white"}} eid={"final1w"} pos={-2} sp={""} sp2={0} key={n} loss={false} ref={"final1w"}
      changematches={this.changematches.bind(this)}/>
    );
    n++;
    boxes.push(
      <MatchBlock sty={{top: wintp + 25 + "px", left: winl + 200 + "px", color: "white"}} eid={"final2w"} pos={-2} sp={""} sp2={1} key={n} loss={true} ref={"final2w"}
      changematches={this.changematches.bind(this)}/>
    );
    n++;
    boxes.push(
      <MatchBlock sty={{top: wintp - 15 + "px", left: winl + 300 + "px", color: "white"}} eid={"final1l"} pos={-3} sp={""} sp2={0} key={n} loss={false} ref={"final1l"}
      changematches={this.changematches.bind(this)}/>
    );
    n++;
    boxes.push(
      <MatchBlock sty={{top: wintp + 35 + "px", left: winl + 300 + "px", color: "white"}} eid={"final2l"} pos={-3} sp={""} sp2={1} key={n} loss={false} ref={"final2l"}
      changematches={this.changematches.bind(this)}/>
    );
    n++;
    boxes.push(
      <MatchBlock sty={{top: wintp + 15 + "px", left: winl + 400 + "px", color: "white"}} eid={"winner"} pos={-3} sp={""} sp2={0} key={n} loss={false} ref={"winner"}
      changematches={this.changematches.bind(this)}/>
    );
    console.log(loserarr);
    return boxes;
  }

  changematches(id1, id2, id3, val) //id1 is winner, id2 is loser, id3 is
  {
    this.refs[id1].cwin();
    this.refs[id2].closs();
    this.refs[id3].ctrue();
    this.refs[id3].cval(val);
    console.log(this.refs[id2].glb());
    if (this.refs[id1].glb() && this.refs[id1].gpos() == -2)
    {
      this.refs["final1l"].cval(this.refs[id2].gval())
      this.refs["final1l"].ctrue();
    }
    if (this.refs[id3].gfin() && !(this.refs[id2].glb()))
    {
      this.refs["final1w"].cval(val);
      this.refs["final1w"].ctrue();
    }
    else if ((this.refs[id3].gfin()))
    {
      this.refs["final2w"].cval(val);
      this.refs["final2w"].ctrue();
    }
    if (!(this.refs[id2].glb()))
    {
      loserval = this.refs[id2].gval();
      this.refs[loserarr[this.refs[id2].ground()-1][this.refs[id2].gmatch()]].cval(loserval); //loserarr[round][match]
      this.refs[loserarr[this.refs[id2].ground()-1][this.refs[id2].gmatch()]].ctrue(); //loserarr[round][match]
    }
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
