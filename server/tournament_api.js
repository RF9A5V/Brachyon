var OrganizeSuite = {
  crush: function(arr, nullNonByeCount, appendNullAfterCrush=false) {
    var res = arr;
    while(res.length > 1){
      var temp = [];
      for(var j = 0; j < res.length / 2; j ++){
        temp.push([res[j], res[res.length - j - 1]]);
      }
      if(appendNullAfterCrush) {
        var nulls = [];
        for(var k = 0; k < nullNonByeCount / 2; k ++){
          nulls.push([null, null])
        }
        temp = nulls.concat(temp);
        appendNullAfterCrush = false;
      }
      res = temp;
    }
    var flatten = function(ary) {
      var ret = [];
      for(var i = 0; i < ary.length; i++) {
        if(Array.isArray(ary[i])) {
          ret = ret.concat(flatten(ary[i]));
        } else {
          ret.push(ary[i]);
        }
      }
      return ret;
    }
    return flatten(res);
  },


  singleElim: function(participants) {
    var roundCount = Math.ceil(Math.log(participants.length) / Math.log(2));

    var byeCount = (Math.pow(2, roundCount) - participants.length);
    var [byes, nonByes] = [participants.slice(0, byeCount), participants.slice(byeCount)];
    var [nullByeCount, nullNonByeCount] = [
      Math.pow(2, roundCount - 1) - byes.length,
      Math.pow(2, roundCount) - nonByes.length
    ];

    byes = byes.concat(Array(nullByeCount).fill(null));

    nonByes = crush(nonByes, nullNonByeCount, true);
    byes = crush(byes, nullNonByeCount);
    var rounds = [];
    var baseMatches = [nonByes, byes];

    for(var i = 0; i < 2; i ++){
      var temp = [];
      for(var j = 0; j < baseMatches[i].length; j += 2) {
        var matchUp = baseMatches[i].slice(j, j + 2);
        var matchObj = {
          playerOne: matchUp[0],
          playerTwo: matchUp[1],
          scoreOne: 0,
          scoreTwo: 0,
          winner: null,
          losm: null,
          losr: null
        }
        temp.push(matchObj);
      }
      rounds.push(temp);
    }

    for(var i = roundCount - 3; i >= 0; i --){
      rounds.push(Array(Math.pow(2, i)).fill({
        playerOne: null,
        playerTwo: null,
        scoreOne: 0,
        scoreTwo: 0,
        winner: null,
        losm: null,
        losr: null
      }));
    }
    return rounds;
  },


  doubleElim: function(participants) {
    frounds = Array(2);
    frounds[0] = singleElim(participants);
    var roundCount = Math.ceil(Math.log(participants.length) / Math.log(2));
    var HalfPoint = (Math.pow(2, roundcount-1) + Math.pow(2, roundcount-2));
    var ovhalf = participants.length > HalfPoint ? true:false;
    var NonbyeCount = ovhalf ? (participants.length - HalfPoint):(HalfPoint - participants.length);
    var nullNonByeCount = (Math.pow(2, roundcount-1) - NonbyeCount);
    nonByes = Array(NonbyeCount).fill(true);

    nonByes = crush(nonByes, nullNonByeCount, true);
    if (ovhalf && participants.length < Math.pow(2, roundcount)) {
      nonByes.unshift(null, null);
      nonByes.splice(nonByes.length-2, 2);
    }
    nonBye[0] = ovhalf ? nonByes:Array(nonByes.length).fill(null);
    nonBye[1] = ovhalf ? Array(nonByes.length).fill(true):nonByes;

    var rounds = [];
    var temp = [];
    for (i = 0; i < 2; i++)
    {
      for(var j = 0; j < nonBye[i].length; j += 2) {
        var matchUp = nonBye[i].slice(j, j + 2);
        var matchObj = {
          playerOne: null,
          playerTwo: null,
          scoreOne: 0,
          scoreTwo: 0,
          winner: null,
          truebye: matchUp[0]
        }
        temp.push(matchObj);
      }
    }
    rounds.push(temp);

    for(var i = roundCount - 3; i >= 0; i-=.5){
      q = Math.floor(i);
      rounds.push(Array(Math.pow(2, i)).fill({
        playerOne: null,
        playerTwo: null,
        scoreOne: 0,
        scoreTwo: 0,
        winner: null
      }));
    }
    frounds[1] = rounds;

    for (i = 0; i < 2; i++)
    {
      for (j = 0; j < frounds[1][i].length; j++)
      {
        if (frounds[1][i][j].truebye)
        {
          if (i == 0 && ovhalf) //If in leftmost set of byes, matches up with winners' nonbyes
          {
            frounds[0][0][j-1].losr = i;
            frounds[0][0][j-1].losm = j;
            frounds[0][0][j].losm = i;
            frounds[0][0][j].losm = j;
          }
          else if (i == 1) //If in second leftmost, first player is always going to be the reverse of round 2, second is potentially
          {
            frounds[0][1][frounds[0][1].length-j].losr = i;
            frounds[0][1][frounds[0][1].length-j].losm = j;
            if (!(frounds[0][0][j].losm))
            {
              frounds[0][0][j].losr = i;
              frounds[0][0][j].losm = j;
            }
          }
        }
      }
    }

    for (i = 3; i < frounds[1].length; i+=2)
      for (j = 0; j < frounds[1][i].length; j++)
      {
        if (i%2 == 0) //Start from bottom of top half of winners and move up, then bottom of bottom half of winners and move up
        {
          if (j < frounds[1][i].length/2) //if in top half of winners, -1 for the offset of arrays starting from 0 instead of 1
            [frounds[1][i][frounds[1][i].length/2 - j - 1].losr, frounds[1][i][frounds[1][i].length/2 - j - 1].losm] = [i, j];
          else //if in bottom half of winners
            [frounds[1][i][frounds[1][i].length - (j - frounds[1][i].length/2) - 1].losr, frounds[1][i][frounds[1][i].length - (j - frounds[1][i].length/2) - 1].losm] = [i, j];
        }
        else //Start from top of bottom half and move down, then top of top half and move down
        {
          if (j < frounds[1][i].length/2)
            [frounds[1][i][frounds[1][i].length/2 + j - 1].losr, frounds[1][i][frounds[1][i].length/2 + j - 1].losm] = [i, j]
          else
            [frounds[1][i][frounds[1][i].length/2 + (j - frounds[1][i].length/2) - 1].losr, frounds[1][i][frounds[1][i].length/2 + (j - frounds[1][i].length/2) - 1].losm] = [i, j]          
        }
      }

    return frounds;
  }
}

export default OrganizeSuite;
