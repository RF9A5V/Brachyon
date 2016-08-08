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

    nonByes = OrganizeSuite.crush(nonByes, nullNonByeCount, true);
    byes = OrganizeSuite.crush(byes, nullNonByeCount);
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
      var temp = [];
      for (var j = 0; j < Math.pow(2, i); j++){
        var matchObj = {
          playerOne: null,
          playerTwo: null,
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
    return rounds;
  },


  doubleElim: function(participants) {
    frounds = Array(2);
    frounds[0] = OrganizeSuite.singleElim(participants);
    var roundCount = Math.ceil(Math.log(participants.length) / Math.log(2));
    var HalfPoint = (Math.pow(2, roundCount-1) + Math.pow(2, roundCount-2));
    var ovhalf = participants.length > HalfPoint ? true:false;
    var NonbyeCount = ovhalf ? (participants.length - HalfPoint):(HalfPoint - participants.length);
    var nullNonByeCount = (Math.pow(2, roundCount) - HalfPoint - NonbyeCount);
    var nonByes = Array(NonbyeCount*2).fill(true);

    nonByes = OrganizeSuite.crush(nonByes, nullNonByeCount*2, true);
    var newbyes = nonByes;
    var nonBye = [];
    nonBye[0] = ovhalf ? nonByes:Array(nonByes.length).fill(null);
    nonBye[1] = ovhalf ? Array(nonByes.length).fill(true):nonByes;

    var rounds = [];
    for (i = 0; i < 2; i++)
    {
      var temp = [];
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
      rounds.push(temp);
    }

    for(var i = roundCount - 3; i >= 0; i-=.5){
      q = Math.ceil(i);
      var temp = [];
      for (var j = 0; j < Math.pow(2, q); j++){
        var matchObj = {
          playerOne: null,
          playerTwo: null,
          scoreOne: 0,
          scoreTwo: 0,
          winner: null,
        }
        temp.push(matchObj);
      }
      rounds.push(temp);
    }
    frounds[1] = rounds;

    //This pile of shit down here is the loser placement. Idea is as follows, we load them as if we had the ceiling of the next power of 2 as we currently have
    //From there the first set of byes, if existing, will have the crush pairing equivalent in the winner's bracket and the bye above that (-1 on their array) as their placers
    //Second set of byes will match up based on the order of existing byes in the winners' bracket. Janky, but we keep going down each "match" until we find a valid one, then place the loser.
    //In the scenario where there's already a winner placed in there (because of ovhalf), then we ignore it and move on.
    for (i = 0; i < 3; i++)
    {
      var q = 0;

      for (j = 0; j < frounds[1][i].length; j++)
      {
        if (frounds[1][i][j].truebye)
        {
          if (i == 0 && ovhalf) //If in leftmost set of byes, matches up with winners' nonbyes
          {
            frounds[0][0][j*2].losr = i;
            frounds[0][0][j*2].losm = j;
            frounds[0][0][j*2+1].losr = i;
            frounds[0][0][j*2+1].losm = j;
          }
          else if (i == 1)
          {
            while (!(frounds[0][0][q].playerOne)) //Find a valid bye in the winners bracket as this set of byes goes orderly down the list.
            {
              q++;
              if (q >= frounds[0][0].length) //For every valid bye, there is a valid winners bracket bye.
                throw error;
            }
            frounds[0][1][frounds[0][1].length-Math.floor(q/2)-1].losr = i;
            frounds[0][1][frounds[0][1].length-Math.floor(q/2)-1].losm = j;
            if (!(frounds[0][0][q].losm)) //These sets are left empty in the scenario where the first set of byes use them.
            {
              frounds[0][0][q].losr = i;
              frounds[0][0][q].losm = j;
            }
            q++;
          }
        }
        if (i == 2 && !(frounds[1][1][j*2].truebye)) //Find every place in the 3rd set of rounds where there isn't two byes leading up to it.
        {
          while ((frounds[0][1][frounds[0][1].length - q - 1].losr)) //Every loser goes orderly up from the bottom of the 2nd round given it's not already used.
          {
            q++;
            if (q >= frounds[0][1].length)
              throw error;
          }
          frounds[0][1][frounds[0][1].length-q-1].losr = i;
          frounds[0][1][frounds[0][1].length-q-1].losm = j;
          if (!(frounds[1][1][j*2+1].truebye))
          {
            q++;
            frounds[0][1][frounds[0][1].length-q-1].losr = i;
            frounds[0][1][frounds[0][1].length-q-1].losm = j;
          }
        }
        q++;
      }
    }

    for (i = 3; i < frounds[1].length; i+=2)
    {
      k = 1+(i-1)/2;
      for (j = 0; j < frounds[1][i].length; j++)
      {
        if (k%2 == 0) //Start from bottom of top half of winners and move up, then bottom of bottom half of winners and move up
        {
          if (j < frounds[0][k].length/2)  //if in top half of winners, -1 for the offset of arrays starting from 0 instead of 1
          {
            frounds[0][k][frounds[0][k].length/2 - j - 1].losr = i;
            frounds[0][k][frounds[0][k].length/2 - j - 1].losm = j;
          }
          else //if in bottom half of winners
          {
            frounds[0][k][frounds[0][k].length - (j - frounds[0][k].length/2) - 1].losr = i;
            frounds[0][k][frounds[0][k].length - (j - frounds[0][k].length/2) - 1].losm = j;
          }
        }
        else //Start from top of bottom half and move down, then top of top half and move down
        {
          if (j < frounds[0][k].length/2)
          {
            frounds[0][k][frounds[0][k].length/2 + j].losr = i;
            frounds[0][k][frounds[0][k].length/2 + j].losm = j;
          }
          else
          {
            frounds[0][k][j - frounds[0][k].length/2].losr = i;
            frounds[0][k][j - frounds[0][k].length/2].losm = j;
          }
        }
      }
    }

    return frounds[0];
  }
}

export default OrganizeSuite;
