/* global chrome: false, Settings: false, Utilities: false */

/**
 * Possible parameters for request:
 *  action: "beacon" for a cross-origin beacon HTTP request,
 *          "get-selectors" for getting selectors from the
 *          server
 *  url   : required, but not validated
 *  data  : data to send in a POST request
 *
 * The callback function is called upon completion of the request */
chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  'use strict';
  if (request.action === 'beacon') {
    var jsonData = JSON.stringify(request.data);
    var sendBeacon = sendBeacon in navigator ? navigator.sendBeacon :
                                               Utilities.sendBeacon;
    var success = sendBeacon(request.url, jsonData);
    callback(success);
    return true;
  }

  if (request.action === 'get-selectors') {
    $.getJSON(
      Settings.Selectors + request.engine,
      function(data) { callback(data); }
    );

    return true;
  }
});
