/* global chrome, SearchEngine, Utilities */
function getSelectors(engine, callback) {
  'use strict';
  chrome.runtime.sendMessage({
    action: 'get-selectors',
    engine: engine
  }, callback);

  return true;
}

function addPreprocessEntry(searchEngine) {
  'use strict';
  var engine = searchEngine.getEngine();
  if (engine === 'Google') {
    searchEngine.preprocessEntry = function(entry) {
      var anchor = $(entry).find('a');
      var href = $(anchor).attr('data-href') || $(anchor).attr('href');
      $(anchor).attr('actual-href', href);
    };
  } else if (engine === 'Bing') {
    searchEngine.preprocessEntry = function(entry) {
      var anchor = $(entry).find('a');
      var href = $(anchor).attr('href');
      $(anchor).attr('actual-href', href);
    };
  } else if (engine === 'Yahoo') {
    searchEngine.preprocessEntry = function(entry) {
      var anchor = $(entry).find('a');
      var href = $(anchor).attr('href');

      var regex = /RU=([^/]*)/;
      href = decodeURIComponent(href.match(regex)[1]);
      $(anchor).attr({ 'actual-href': href, 'target': '_self' });
    };
  }
}

function initExtension() {
  'use strict';
  window.addEventListener('unload', function() { Utilities.sendBuffer(); });
  Utilities.registerUser();

  var searchEngine = new SearchEngine();
  var engine = searchEngine.getEngine();

  getSelectors(engine, function(selectors) {
    searchEngine.selectors = selectors;
    addPreprocessEntry(searchEngine);
    searchEngine.init();
  });
}

initExtension();
