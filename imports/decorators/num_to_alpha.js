// Converts a base-10 number to a pseudo-base-26 number with digits being the letters in the English alphabet.
// Not sure why I would explain about the English alphabet part, should be kinda self explanatory.
// Unless we're doing Cyrillic conversion in the future. In which case, kill me now.

const numToAlpha = (num, zeroIndex) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var str = ""
  if(!zeroIndex) {
    num --;
  }
  do {
    str = alphabet[num % 26] + str;
    num = parseInt(num / 26) - 1;
  } while(num >= 0);
  return str;
}

export { numToAlpha }
