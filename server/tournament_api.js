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
    var frounds = [];
    frounds.push(rounds);
    return frounds;
  },

  testDoubleElim: function(participants) {
    var brackets = {
      winners: OrganizeSuite.singleElim(participants),
      losers: []
    };
    var initArray = brackets.winners.slice(0, 2);
    var [losersRoundOne, nullPush] = [[], []];

    for(var i = 0; i < initArray[0].length; i += 2){
      if(initArray[0][i].playerOne != initArray[0][i].playerTwo) {
        var matchIndex = i / 2;
        [initArray[0][i].loserMatch, initArray[0][i + 1].loserMatch] = [matchIndex, matchIndex];
        [initArray[0][i].loserRound, initArray[0][i + 1].loserRound] = [0, 0];
        losersRoundOne.push({
          playerOne: null,
          playerTwo: null,
          scoreOne: 0,
          scoreTwo: 0,
          winner: null,
          isPlaceholder: false
        });
      }
      else {
        nullPush.push(i + 1);
        losersRoundOne.push({
          playerOne: null,
          playerTwo: null,
          scoreOne: 0,
          scoreTwo: 0,
          winner: null,
          isPlaceholder: true
        })
      }
    }
    var losersRoundTwo = [];
    var counter = initArray[1].length - 1;
    for(var i = 0; i < losersRoundOne.length; i ++){
      if(losersRoundOne[i].isPlaceholder) {
        var byeIndex = nullPush.shift();
        [initArray[0][byeIndex].loserMatch, initArray[0][byeIndex].loserRound] = [i, 1];
      }
      [initArray[1][counter].loserMatch, initArray[1][counter].loserRound] = [i, 1];
      counter -= 1;
    }
    brackets.winners[0] = initArray[0];
    brackets.winners[1] = initArray[1];
    console.log(brackets);
    return brackets;
  },

  doubleElim: function(participants) {
    frounds = Array(2);
    frounds[0] = OrganizeSuite.singleElim(participants)[0];
    var roundCount = Math.ceil(Math.log(participants.length) / Math.log(2));
    var HalfPoint = (Math.pow(2, roundCount-1) + Math.pow(2, roundCount-2));
    var ovhalf = participants.length > HalfPoint ? true:false;
    var NonbyeCount = ovhalf ? (participants.length - HalfPoint):(participants.length - Math.pow(2, roundCount-1));
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

    for(var i = roundCount - 3; i > -1; i-=.5){
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

//Even Steven System, appropriately named because Steven thought the above system was (rightfully so) stupid, although bottom system may not be as grand as his idea.
//Concept is as follows, check the even bye, if exists, put it and the odd bye (which always exists in this case) to their 1-1 equivalent in the left.
//Second round in this case will always put their bye in where the bye is, divided by 2, and reversed from the top. It is labelled k.
//If even bye doesn't exist but odd bye does, we have two situations:
//If the bye's integer placement divided by 2 is even, check if the top loser nonbye exists of the pair as it is orderly. If it doesn't or it is odd, put it in the bottom
//Also put the reverse round k with it since they are matched based on the placement if their equivalent nonbye.
//Finally, if no nonbye exists, then just throw k in the third round. They just go based off of their place divided by 2
    for (j = 0; j < frounds[0][0].length; j+=2)
    {
      var k = frounds[0][1].length - Math.floor(j/2) - 1;
      if (frounds[0][0][j].playerOne != null) //Even nonbye exists.
      {
        [frounds[0][0][j].losr, frounds[0][0][j].losm] = [0, Math.floor(j/2)];
        [frounds[0][0][j+1].losr, frounds[0][0][j+1].losm] = [0, Math.floor(j/2)];
        [frounds[0][1][k].losr, frounds[0][1][k].losm] = [1, Math.floor(j/2)];
      }
      else if (frounds[0][0][j+1].playerOne != null) //Even doesn't exist, odd does.
      {
        var l = Math.floor((j+1)/4) * 2;
        if (Math.floor((j+1)/2)%2 == 0 && frounds[1][1][l].truebye != null) //Nonbye is in even top half, odd bottom half exist, put them in the top half loser nonbye.
        {
          [frounds[0][0][j+1].losr, frounds[0][0][j+1].losm] = [1, l];
          [frounds[0][1][k].losr, frounds[0][1][k].losm] = [1, l];
        }
        else //Loser belongs in the bottom half of the pair of byes, or top half doesn't exist and therefore it automatically goes here.
        {
          [frounds[0][0][j+1].losr, frounds[0][0][j+1].losm] = [1, l+1];
          [frounds[0][1][k].losr, frounds[0][1][k].losm] = [1, l+1];
        }
      }
      else //No nonbye exists, automatically gets thrown into the third round
      {
        [frounds[0][1][k].losr, frounds[0][1][k].losm] = [2, Math.floor(j/4)]
      }
    }


    //This shits pretty weird, but essentially for every loser round that is even, you want to start from the last element of the top half and move bottom to top, then do the same for the bottom half.
    //For odds, you go on the top of the bottom half and work from top to bottom, then from the top half, top to bottom.
    for (i = 3; i < frounds[1].length; i+=2)
    {
      k = 1+(i-1)/2;
      for (j = 0; j < frounds[1][i].length; j++)
      {
        if (k%2 == 0) //Start from bottom of top half of winners and move up, then bottom of bottom half of winners and move up
        {
          if (j < Math.floor(frounds[0][k].length/2))  //if in top half of winners, -1 for the offset of arrays starting from 0 instead of 1
          {
            console.log(Math.floor(frounds[0][k].length/2) - j - 1);
            frounds[0][k][Math.floor(frounds[0][k].length/2) - j - 1].losr = i;
            frounds[0][k][Math.floor(frounds[0][k].length/2) - j - 1].losm = j;
          }
          else //if in bottom half of winners
          {
            frounds[0][k][frounds[0][k].length - (j - Math.floor(frounds[0][k].length/2)) - 1].losr = i;
            frounds[0][k][frounds[0][k].length - (j - Math.floor(frounds[0][k].length/2)) - 1].losm = j;
          }
        }
        else //Start from top of bottom half and move down, then top of top half and move down
        {
          if (j < Math.floor(frounds[0][k].length/2))
          {
            frounds[0][k][Math.floor(frounds[0][k].length/2) + j].losr = i;
            frounds[0][k][Math.floor(frounds[0][k].length/2) + j].losm = j;
          }
          else
          {
            frounds[0][k][j - Math.floor(frounds[0][k].length/2)].losr = i;
            frounds[0][k][j - Math.floor(frounds[0][k].length/2)].losm = j;
          }
        }
      }
    }

    var finalround = [], temp = [];
    for (i = 0; i < 2; i++)
    {
      temp = []
      var matchObj = {
        playerOne: null,
        playerTwo: null,
        scoreOne: 0,
        scoreTwo: 0,
        winner: null,
      }
      temp.push(matchObj);
      finalround.push(temp);
    }
    frounds.push(finalround);
    return frounds;
  },

  swiss: function(participants) {
    var frounds = [];
    var exbye = false;
    var length = participants.length;
    if (participants.length%2 == 1)
    {
      exbye = true;
      length--;
    }

    var temp = [];
    for (var x = 0; x < length/2; x++)
    {
      var matchObj = {
        playerOne: participants[x],
        playerTwo: participants[x+length/2],
        played: false,
        p1score: 0,
        p2score: 0,
        ties: 0
      };
      temp.push(matchObj);
    }
    var tempb = [];
    var tempc = [];
    for (var x = 0; x < participants.length; x++)
    {
      var playarr = [];
      for (var y = 0; y < participants.length; y++)
      {
        playarr[participants[y]] = false;
      }
      tempc[participants[x].name] = x;
      var playerObj = {
        name: participants[x],
        score: 0,
        bnum: 0,
        wins: 0,
        losses: 0,
        bye: false,
        playedagainst: playarr
      }
      if (exbye && x == participants.length-1)
      {
        playerObj.score = 3;
        playerObj.bye = true;
      }
      tempb.push(playerObj);
    }
    var frounds = [];
    var round = {
      matches: temp,
      players: tempb,
      pdic: tempc
    }
    frounds.push(round);
    return frounds;
  },
  roundRobin: function(participants) {
    var frounds = [];
    var score = 3, bye = false;
    var temp = [];
    var length = participants.length;
    if (length%2 == 1)
    {
      participants.push("");
      length++;
    }
    for (var x = 0; x < Math.floor(length/2); x++)
    {
      if (participants[length-1-x] != "")
      {
        var matchObj = {
          playerOne: participants[x],
          playerTwo: participants[length-1-x],
          played: false,
          p1score: 0,
          p2score: 0,
          ties: 0
        };
        temp.push(matchObj);
      }
    }
    var tempb = [];
    var tempc = [];
    for (var x = 0; x < participants.length; x++)
    {
      var playarr = [];
      tempc[participants[x]] = x;
      var playerObj = {
        name: participants[x],
        score: 0,
        wins: 0,
        losses: 0,
        ties: 0
      };
      tempb.push(playerObj);
    }
    var roundObj = {
      matches: temp,
      players: tempb,
      pdic: tempc,
      score: score
    }
    frounds.push(roundObj);

    return frounds;
  }
}



export default OrganizeSuite;
