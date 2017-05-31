const leftPadZero = function(str, len) {
  const expected = len - str.length;
  for(var i = 0; i < expected; i ++) {
    str = "0" + str;
  }
  return str;
}

const bracketHashGenerator = (count) => {
  const min = Math.pow(56, 3);
  const max = Math.pow(56, 4);
  var counter = leftPadZero((count % 91 + 1).toString(), 2);
  var rando = leftPadZero(parseInt(Math.random() * 10000).toString(), 3);
  var dateComp = leftPadZero(((new Date()).getTime() % 100).toString(), 2);
  const token = parseInt(counter + rando + dateComp);
  var hash = (token + (min)) % (max + min);
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const charSet = alphabet + alphabet.toUpperCase() + "0123456789";
  var tok = "";
  while(hash > 0) {
    tok += charSet[hash % 56];
    hash = parseInt(hash / 56);
  }
  return tok;
}

export { bracketHashGenerator };
