function normalize(s) {
  var out = s;

  out = out.toLowerCase();

  out = out.replace(/ /g, "");

  out = out.replace(/'/g, "");

  out = out.replace(/’/g, "");

  out = out.replace(/-/g, "");

  return out;
};


FuzzyMatch = {

  contains: function(whole, piece) {
    return normalize(whole).indexOf(normalize(piece)) !== -1;
  },

  equals: function(a, b) {
    return normalize(a) == normalize(b);
  }

}
