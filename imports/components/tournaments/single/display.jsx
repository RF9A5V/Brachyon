import React, { Component } from 'react'

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
      console.log(array);
    }
    return array;
  }

  formbrackets() {
    var num = 18, matchn = 1, i, spacing = 0;
    var nonbyes = (num - Math.pow(2, Math.floor(Math.log2(num))))*2;
    var byes = num - nonbyes;
    var rounds = Math.ceil(Math.log2(num));
    var boxes = []

    //This will determine the spacing and placement for the nonbyes.
    var roundparticipants = num - nonbyes/2;
    if (nonbyes > 0)
    {
      var nbarr = Array.apply(null, Array(roundparticipants*2)).map(function (_, i) {return i+1;});
      var aseed = this.seed(nbarr), w = 0;
      matchn++;
      for (i = 0; i < nonbyes; i+=2)
      {
        for (w = 0; w < 2; w++)
        {
          var boxid = "match" + i + "nonbye";
          var style = {
            top: aseed.indexOf(byes+i+1+w)*50 - 25 + "px",
            left: 200 + "px"
          }
          boxes.push(
            <div className="tbox" id={boxid} style = {style}>
              Nonbye {i+1+w}
            </div>
          )
        }
      }
    }

    while (matchn <= rounds+1)
    {
      for (i = 0; i < roundparticipants; i++)
      {
        {
          var boxid = "match" + i + "round" + matchn;
          var style = {
            top: i*50*Math.pow(2,matchn-1)+spacing + "px",
            left: matchn*200 + "px"
          };
          if (roundparticipants == (num - nonbyes/2) && (i == 0 || i+1 > (nonbyes/2 + 1)))
          {
            boxes.push(
              <div className="tbox" id={boxid} style = {style}>
                Box {i+1}
              </div>
            )
          }
          else
          {
            boxes.push(
              <div className="tbox" id={boxid} style = {style}>
                Box
              </div>
            )
          }
        }
      }
        spacing = spacing+Math.pow(2, matchn-1)*25;
        matchn++;
        roundparticipants = roundparticipants/2;
    }

    return boxes;
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
