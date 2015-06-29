// Get current Search Engine
var engine = SearchEngine.getEngineByName();


// For some reason wrapping every text node in a span breaks the Google
// results page, so we have to disable wrapping in this case.
if (engine !== 'Google') {
  Utilities.wrapTextNodesInTag('span', true);
}


// Register Hover handler on the span tags, logs every hover
Utilities.logHoverEventOnTags('span');


Utilities.addHandlerToAnchors();

// Log the current search event, in case we are on a SERP
if (engine !== 'Invalid') {
  Utilities.sendObject({
    'Event': 'Query',
    'Engine': engine,
    'Query': SERPTools.getQuery(),
    'Results': SERPTools.getResultsList()
  });
};


// Make sure we send the data to our server before we unload the page.
window.onbeforeunload = function() {
  Utilities.sendBuffer();
};
