var formatter = function(val, useShort) {
  switch(val) {
    case "single_elim": return useShort ? "SE" : "Single Elimination";
    case "double_elim": return useShort ? "DE" : "Double Elimination";
    case "swiss": return useShort ? "SW" : "Swiss";
    case "round_robin": return useShort ? "RR" : "Round Robin";
    default: return "Unknown";
  }
}

export { formatter }
