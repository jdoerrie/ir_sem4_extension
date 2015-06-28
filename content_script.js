
// var get_google_data = function() {
//   var engine = get_search_engine();
//   console.log("Search Engine: " + get_engine_name(engine));

//   // return early if the current page is not Google
//   if (engine !== SearchEngineEnum.GOOGLE) {
//     return;
//   }

//   // replace all a href in result lists by a data-href on the page, gets rid of
//   // implicit Google redirect
//   $('#rso a[data-href]').attr('href', function() {
//     return $(this).attr('data-href')
//   })

//   $('#rso h3.r a').delay('1000').each(function( index ) {
//     console.log(index + ": " + $(this).text() + " " + $(this).attr('href'));
//     $(this).attr("search_rank", index);
//   });
$('a').click(function(){
  var url = this.href;
  Utilities.logObject({
    'Event': 'Click',
    'URL': url
  });
  // $.ajax({
  //   async: false,
  //   type: "POST",
  //   url: "Logger.ff", //dynamic url to logging action
  //   data: {
  //     sid: 'abc123' //random data
  //       clicked: url
  //   },
  //   contentType: "application/x-www-form-urlencoded; charset=UTF-8",
  //   cache: false
  // });
  // return true;
});


// var bodyEl = document.getElementsByTagName('body')[0];
// var textNodes = getTextNodesIn(bodyEl);

// $.each(textNodes, function(idx, node) {
//   $(node).replaceWith(node.nodeValue.replace(/(\S+)/g, '<span>$1</span>'));
// });

// var makeSpans = function(selector) {
//   if (selector == null) {
//     return;
//   }
//   // console.log(selector);
//   if (selector[0].nodeType === Node.TEXT_NODE) {
//       var val = selector[0].nodeValue;
//       selector.replaceWith(val.replace(reg, '<span>$1</span>'));
//   } else {
//     selector.contents().each(function() {
//       makeSpans($(this));
//     });
//   }
// };

// makeSpans($('body'));

// $('span').hover(
//   function() { $(this).css('background-color','#ffff66'); },
//   function() { $(this).css('background-color',''); }
// );
// console.log('In makeSpans');
// $('*').contents()
//   .filter(function() {
//     return this.nodeType === 3;
//   }).each(function() {
//     var val = this.nodeValue;
//     var reg = /\b(\w+)\b/g;
//     $(this).replaceWith(val.replace(reg, '<span>$1</span>'));
//   });

// };

// };

if (location.hostname.indexOf('google') === -1) {
  Utilities.wrapTextNodesInTag('span', true);
}

Utilities.logHoverEventOnTags('span');
var engine = SearchEngine.getEngineByName();
if (engine !== 'Invalid') {
  Utilities.logObject({
    'Engine': engine,
    'Query': SERPTools.getQuery(),
    'Results': SERPTools.getResultsList(),
    'UserAgent': navigator.userAgent
  });
};

window.onbeforeunload = function() {

  chrome.runtime.sendMessage({
    action: 'beacon',
    url: "http://localhost:8000/polls/1/vote/",
    // data: 'choice=1'
    data: {'choice': '1'}
  }, function(success) {
    /*Callback function to deal with the response*/
    console.log("Beacon: " + success);
  });
  // chrome.runtime.sendMessage({
  //   method: 'POST',
  //   action: 'xhttp',
  //   async: false,
  //   url: "http://localhost:8000/polls/1/vote/",
  //   data: 'choice=1'
  // }, function(responseText) {
  //   console.log(responseText);
  //   /*Callback function to deal with the response*/
  // });
  // var request = $.ajax({
  //   url: "http://localhost:8000/polls/1/vote",
  //   type: 'POST',
  //   async: false,
  //   data: {'coice': '1'}
  // });

  // request.done(function(data) {
  //   console.log("Success: " + data);
  // })

  // request.fail(function(jqXHR, textStatus) {
  //   console.log( "Request failed: " + textStatus );
  // })

  // request.always(function() {
  //   console.log( "complete" );
  // });
};

$(document).ajaxComplete(function(event, xhr, settings) {
  console.log("Ajax Event completed");
  console.log(xhr.responseText);
});
//
// $(document).ready(function() {
//   setTimeout(function() {
//     var engine = SearchEngine.getEngineByName();
//     // makeSpans();
//     if (engine !== 'Invalid') {
//       Utilities.logObject({
//         'Engine': engine,
//         'Query': SERPTools.getQuery(),
//         'Results': SERPTools.getResultsList(),
//         'UserAgent': navigator.userAgent
//       });
//     }
//   }, 500);
// });
