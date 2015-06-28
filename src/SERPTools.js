// This object defines tools to parse the Search Engine Result Page
// (SERP) of Google, Yahoo and Bing
function SERPTools() {
}

// Obtain the current query by reading it off the search query box.
// Assumes that the selectors will always work.
// TODO: Figure out a more robust way.
SERPTools.getQuery = function() {
  var querySelector;
  var engine = SearchEngine.getEngine();
  switch (engine) {
    case SearchEngineEnum.Google:
      // Depending of whether JavaScript is diabled on Google or not
      // the id of the search box changes to we have to take this into
      // acccount here.
      querySelector = Settings.DisableJSonGooglePages ?
        '#sbhost': '#lst-ib';
      break;

    case SearchEngineEnum.Bing:
      querySelector = '#sb_form_q';
      break;

    case SearchEngineEnum.Yahoo:
      querySelector = '#yschsp';
      break;

    default:
      return null;
  }

  return $(querySelector).val();
};

// This utility function tries to find out the current page number by
// looking at the bottom navigaton panel and figure out which number is
// highlighted.
SERPTools.getResultsPageNumber = function() {
  var pageNumberSelector;
  var engine = SearchEngine.getEngine();
  switch (engine) {
    case SearchEngineEnum.Google:
      pageNumberSelector = Settings.DisableJSonGooglePages ?
        '#nav b' : '#navcnt .cur';
      break;

    case SearchEngineEnum.Bing:
      pageNumberSelector = '#b_results .sb_pagS';
      break;

    case SearchEngineEnum.Yahoo:
      pageNumberSelector = '.compPagination strong';
      break;

    default:
      return null;
  }
  return $(pageNumberSelector).text();
};

SERPTools.getResultsList = function() {
  var resultsSelector;
  var resultsList = [];
  var engine = SearchEngine.getEngine();
  switch (engine) {
    case SearchEngineEnum.Google:
      // replace all a href in result lists by a data-href on the page,
      // rgets id of implicit Google redirect
      $('#rso a[data-href]').attr('href', function() {
        return $(this).attr('data-href');
      });

      resultsSelector = Settings.DisableJSonGooglePages ?
        '#search h3.r a' : '#rso h3.r a';
      break;

    case SearchEngineEnum.Bing:
      resultsSelector = '#b_results li.b_algo h2 a';
      break;

    case SearchEngineEnum.Yahoo:
      resultsSelector = '#web h3 a';
      break;

    default:
      return null;
  }

  var pageNumber = SERPTools.getResultsPageNumber();
  $(resultsSelector).delay('1000').each(function(index) {
    var text = $(this).text();
    var href = $(this).attr('href');
    var idx = pageNumber * 10 + index - 9;

    // Yahoo is being a bitch here, it redirects its results but does
    // not provide a data-href like Google does. Luckily it is possible
    // to extract the relevant part from the redirect URL and decode it.
    if (engine === SearchEngineEnum.Yahoo) {
      var regex = /RU=([^/]*)/;
      href = decodeURIComponent(href.match(regex)[1]);
    }

    resultsList.push({
      'rank': idx,
      'text': text,
      'href': href
    });

    // we define a custom search rank attribute on every node here so
    // wthat it ill be easier to log the clicked result later.
    $(this).attr("search_rank", idx);

    // Register Click Handler
    $(this).click(function(event) {
      Utilities.logObject({
        'Event': "Click",
        'URL': window.location.href,
        'PageX': event.pageX,
        'PageY': event.pageY,
        'Link': href,
        'Rank': idx,
        'Text': text
      });
    });
  });

  return resultsList;
}
