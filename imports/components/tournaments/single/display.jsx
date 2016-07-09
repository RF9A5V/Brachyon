import React, { Component } from 'react'

export default class SingleDisplay extends Component {

  seed(array) {
    if (array.size > 1)
    {
      var narr = []
      for (i = 0; i < array.size/2; i++)
        narr[i] = [array[i], array[array.size-i-1]];
      array = this.seed(narr);
    }
    else {
      flatten(array);
    }
    return array;
  }

  formbrackets() {
    var num = 17, matchn = 1, i, spacing = 0;
    var nonbyes = (num - Math.pow(2, Math.floor(Math.log2(num))))*2;
    var byes = num - nonbyes;
    var rounds = Math.ceil(Math.log2(num));
    var boxes = []

    //This will determine the spacing and placement for the nonbyes.
    if (nonbyes > 0)
    {
      var aseed = this.seed(Array.apply(null, Array(nonbyes)).map(function (_, i) {return i+byes+1;}));
      matchn++;
      for (i = 0; i < nonbyes; i++)
      {
        var boxid = "match" + i + "nonbye";
        var style = {
          top: i*50 + "px",
          left: 200 + "px"
        }
        boxes.push(
          <div className="tbox" id={boxid} style = {style}>
            Nonbye {i+1}
          </div>
        )
      }
    }

    var roundparticipants = num - nonbyes/2;
    while (matchn <= rounds+1)
    {
      console.log(matchn);
      for (i = 0; i < roundparticipants; i++)
      {
        {
          var boxid = "match" + i + "round" + matchn, evenseed=1, oddseed=1;
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
