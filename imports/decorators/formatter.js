var formatter = function(val) {
  switch(val) {
    case "single_elim": return "Single Elimination";
    case "double_elim": return "Double Elimination";
    case "swiss": return "Swiss";
    case "round_robin": return "Round Robin";
    default: return "Unknown";
  }
}

export { formatter }
