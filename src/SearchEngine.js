/* global Utilities: false */
// SearchEngines contains the supported Search Engines. It tries to
// simulate an enum, where the values are for convenience.
var SearchEngines = Object.freeze({
  Google:  'Google',
  Bing:    'Bing',
  Yahoo:   'Yahoo',
  Invalid: 'Invalid'
});

var SearchEngine = function(params) {
  'use strict';
  params = params || {};
  params.selectors = params.selectors || {};
  params.preprocessEntry = params.preprocessEntry || {};
  // Selectors is a collection of jQuery selectors to retrieve relevant
  // parts of the SERP. Selectors is expected to have the following
  // keys:
  // - query
  // - results
  // - resultsEntry
  // - navbar
  // - currPage
  // this.selectors = params.selectors;

  // preprocessEntry is a function that is called on every entry in the
  // result page to make it easier to obtain the link they are pointing
  // to. This is definitely necessary for Google and Yahoo, who like to
  // redirect the user before sending him to the actual result.
  // this.preprocessEntry = params.preprocessEntry;
};

SearchEngine.prototype.init = function() {
  'use strict';
  var that = this;
  this.onPageLoad(function() {
    if (that.getEngine() !== 'Invalid') {
      that.processSearchResults();
      that.sendQuery();
    }

    Utilities.wrapTextNodesInTagAndAddHandlers('span', {
      mouseenter: function() {
        var time = Date.now();
        $(this).attr('start-hover', time);
      },

      mouseleave: function() {
        var duration = Date.now() - $(this).attr('start-hover');
        Utilities.sendObject({
          Event: 'Hover',
          URL: window.location.href,
          Text: $(this).text(),
          PageX: event.pageX,
          PageY: event.pageY,
          Duration: duration
        }, /* isBuffered */ true);
      }
    });

    that.installHandlers();
  });
};

// Figure out current SearchEngine by looking at both the hostname and
// pathname. Pathname is necessary to distinguish Google Search from
// Google Maps, for example.
SearchEngine.prototype.getEngine = function() {
  'use strict';
  if (this.engine) {
    return this.engine;
  }

  var hostname = location.hostname;
  var pathname = location.pathname;

  if (hostname.indexOf('google') !== -1) {
    this.engine = SearchEngines.Google;
  } else if (hostname.indexOf('bing') !== -1 &&
      pathname.indexOf('search') !== -1) {
    this.engine = SearchEngines.Bing;
  } else if (hostname.indexOf('search.yahoo') !== -1 &&
      pathname.indexOf('search') !== -1) {
    this.engine = SearchEngines.Yahoo;
  } else {
    this.engine = SearchEngines.Invalid;
  }

  return this.engine;
};

// This method simulates the onLoad event, however is also able to
// detect changes in the DOM due to ajax events. In order to achieve
// this, it listens on changes in the childList of every node in the
// document and will reset a specified counter when this happens. We
// make the assumption that the page is fully loaded when the delay has
// passed without further changes in the DOM. This can be error prone,
// especially on weak connections, but it is hard to find a better
// solution. When the page seems ready, the callback is executed.
SearchEngine.prototype.onPageLoad = function(callback, delay) {
  'use strict';
  delay = delay || 500;
  var options = { subtree: true, childList: true };

  var myFunc = function() {
    observer.disconnect();
    callback();
    observer.observe(document, options);
  };

  var timer = setTimeout(function() { myFunc(); }, delay);
  var observer = new window.MutationObserver(function() {
    clearTimeout(timer);
    timer = setTimeout(function() { myFunc(); }, delay);
  });

  observer.observe(document, options);
};


// SearchEngine.getQuery() returns the current query if we are on a page
// SearchEngineand stores it into the this.query property.
SearchEngine.prototype.getQuery = function() {
  'use strict';
  this.query = this.getEngine() !== 'Invalid' ?
    $(this.selectors.searchForm).val() : null;
  return this.query;
};


// SearchEngine.sendQuery() will send the current Query to the Logging
// server.
SearchEngine.prototype.sendQuery = function() {
  'use strict';
  Utilities.sendObject({
    Event: 'Query',
    Engine: this.getEngine(),
    Query: this.getQuery(),
    Results: this.getSearchResults()
  });
};


// SearchEngine.processSearchResults() processes the search results on a
// given page by augmenting it with the rank of the result and calling
// preprocessEntry() on it. After that it is expected that the actual
// link is contained in the attribute 'actual-href'.
SearchEngine.prototype.processSearchResults = function() {
  'use strict';
  var currResultsPage = $(this.selectors.currResultsPage).text();
  var resultsEntries = $(this.selectors.resultsEntry);
  var numResultsOnPage = resultsEntries.length;

  var numPrevResults = numResultsOnPage * (currResultsPage - 1);
  var that = this;
  resultsEntries.each(function(idx) {
    $(this).attr('result-rank', numPrevResults + idx + 1);
    that.preprocessEntry($(this));
  });
};


// SearchEngine.getSearchResults() iterates through the current results
// on the Search Result page and collects their information in an array
// which is sent back to the call site.
SearchEngine.prototype.getSearchResults = function() {
  'use strict';
  var searchResults = [];
  $(this.selectors.resultsEntry).each(function() {
    searchResults.push({
      'Rank': $(this).attr('result-rank'),
      'Text': $(this).find('a')[0].text(),
      'Link': $(this).find('a')[0].attr('actual-href'),
      'Desc': $(this).not('a').text()
    });
  });

  return searchResults;
};


SearchEngine.prototype.installHandlers = function() {
  'use strict';
  // Register Click Handlers on Links
  $('a').off('click').on('click', function() {
    Utilities.sendObject({
      Event: 'Click',
      CurrURL: window.location.href,
      PageX: event.pageX,
      PageY: event.pageY,
      Link: $(this).attr('actual-href') || $(this).attr('href'),
      Rank: $(this).attr('result-rank'),
      Text: $(this).text()
    });
  });
};
