// SearchEngineEnum containing the supported Search Engines
var SearchEngineEnum = Object.freeze({
  'Google': 1,
  'Bing': 2,
  'Yahoo': 3,
  'Invalid': 0
});

function SearchEngine() {
}

// Figure out current SearchEngine by looking at both the hostname and
// pathname. Pathname is necessary to distinguish Google Search from
// Google Maps, for example.
SearchEngine.getEngine = function() {
  var hostname = location.hostname;
  var pathname = location.pathname;
  if (hostname.indexOf('google') !== -1 &&
      pathname.indexOf('search') !== -1) {
    return SearchEngineEnum.Google;
  } else if (hostname.indexOf('bing') !== -1) {
    return SearchEngineEnum.Bing;
  } else if (hostname.indexOf('search.yahoo') !== -1) {
    return SearchEngineEnum.Yahoo;
  } else {
    return SearchEngineEnum.Invalid;
  }
};

// Resolve the name of the current Search Engine.
SearchEngine.getEngineByName = function() {
  var engine = SearchEngine.getEngine();
  for (var name in SearchEngineEnum) {
    if (SearchEngineEnum[name] === engine) {
      return name;
    }
}

  return 'Invalid';
};
