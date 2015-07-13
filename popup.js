/* global Utilities: false */
$(document).ready(function() {
  'use strict';
  Utilities.getUserId(function(userId) {
    $('#userId').text(userId);
  });
});
