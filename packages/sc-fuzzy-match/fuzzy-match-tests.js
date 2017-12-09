

Tinytest.add('FuzzyMatch - equals', function(test) {

  _.each({
    "abc": "abc",
    "Abc": "ABc",
    "Foo": "FoO",
    "Out in the rain": "outintherain",
    "they're": "theyre",
      "hula’s": "hulas"
    "THe End": "the end",
    "Foo-bar": "foobar",
  }, function(b, a) {
    test.isTrue(FuzzyMatch.equals(a, b), 'comparing "' + a + '" and "' + b + '"');
  });

  _.each({
    "Foo": "Foood",
    "aoienst": "mTETESI",
    "fooB": "f00b",
    "marbel": "Marble"
  }, function(b, a) {
    test.isFalse(FuzzyMatch.equals(a, b), 'comparing "' + a + '" and "' + b + '"');
  });

});

Tinytest.add('FuzzyMatch - contains', function(test) {

  _.each({
    "abc": "abc",
    "Abc": "ABc",
    "Foo": "FoO",
    "rain": "Out in the rain",
    "they're": "theyre",
    "End": "the end",
    "Foo-b": "foobar",
    "blue lagoon": "The Blue Lagoon",
    "Marini": "Marini's"
  }, function(whole, piece) {
    test.isTrue(FuzzyMatch.contains(whole, piece), '"' + whole + '" contains  "' + piece + '"');
  });

  _.each({
    "Food": "Foood",
    "aoienst": "mTETESI",
    "fooB": "f00b by",
    "marbel": "Marble"
  }, function(b, a) {
    test.isFalse(FuzzyMatch.equals(a, b), 'comparing "' + a + '" and "' + b + '"');
  });

});
