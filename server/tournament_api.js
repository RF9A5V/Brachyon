var OrganizeSuite = {
  singleElim: function(participants) {
    var roundCount = Math.ceil(Math.log(participants.length) / Math.log(2));

    var byeCount = (Math.pow(2, roundCount) - participants.length);
    var [byes, nonByes] = [participants.slice(0, byeCount), participants.slice(byeCount)];
    var [nullByeCount, nullNonByeCount] = [
      Math.pow(2, roundCount - 1) - byes.length,
      Math.pow(2, roundCount) - nonByes.length
    ];

    byes = byes.concat(Array(nullByeCount).fill(null));

    var crush = function(arr, appendNullAfterCrush=false) {
      var res = arr;
      var iterations = Math.ceil(Math.log(arr.length) / Math.log(2));
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
    }

    nonByes = crush(nonByes, true);
    byes = crush(byes);

    var rouns = [];
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
          winner: null
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
        winner: null
      }));
    }
    return rounds;
  },
  doubleElim: function(participants) {
    rounds = Array(2);
    rounds[0] = singleElim(participants);
    var roundCount = Math.ceil(Math.log2(participants.length));

    var byeCount = (Math.pow(2, roundCount) - participants.length);
    var [byes, nonByes] = [participants.slice(0, byeCount), participants.slice(byeCount)];
    var [nullByeCount, nullNonByeCount] = [
      Math.pow(2, roundCount - 1) - byes.length,
      Math.pow(2, roundCount) - nonByes.length
    ];

    byes = byes.concat(Array(nullByeCount).fill(null));
  }
}

export default OrganizeSuite;
