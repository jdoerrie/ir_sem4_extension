/* global chrome: false, Settings: false */
function Utilities() {
}


// Utility function to escape HTML characters, which replaces reserved
// characters by their html version.
 Utilities.escapeHtml = function(string) {
  'use strict';
  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
    '/': '&#x2F;'
  };

  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
};


Utilities.buffer = [];


Utilities.getRandomToken = function() {
  'use strict';
  // E.g. 8 * 32 = 256 bits token
  var randomPool = new Uint8Array(32);
  window.crypto.getRandomValues(randomPool);
  var hex = '';
  for (var i = 0; i < randomPool.length; ++i) {
    hex += randomPool[i].toString(16);
  }
  // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
  return hex;
};


Utilities.getUserId = function(callback) {
  'use strict';
  chrome.storage.sync.get('UserId', function(items) {
    var UserId = items.UserId;
    if (UserId) {
      callback(UserId);
    } else {
      UserId = Utilities.getRandomToken();
      chrome.storage.sync.set({UserId: UserId}, function() {
        callback(UserId);
      });
    }
  });
};


Utilities.phoneHome = function(data, callback) {
  'use strict';
  if (!Array.isArray(data)) {
    data = [data];
  }

  chrome.runtime.sendMessage({
    'action': 'beacon',
    'url': Settings.Endpoint,
    'data': data
  }, callback);
};


Utilities.sendObject = function(obj, isBuffered) {
  'use strict';
  isBuffered = typeof isBuffered !== 'undefined' ?  isBuffered : false;

  obj.Timestamp = Date.now();
  Utilities.getUserId(function(UserId) {
    obj.UserId = UserId;
    if (isBuffered) {
      Utilities.buffer.push(obj);
    } else {
      Utilities.phoneHome(obj);
    }
  });
};


Utilities.sendBuffer = function() {
  'use strict';
  Utilities.phoneHome(Utilities.buffer, function(success) {
    if (success) {
      Utilities.buffer.length = 0;
    }
  });
};


// This Utility function registeres the current User with the Server by
// sending its UserAgent. This is done only once during the life team of
// the session.
Utilities.registerUser = function() {
  'use strict';
  if (Utilities.registeredUser) {
    return;
  }

  Utilities.sendObject({
    Event: 'UserAgent',
    UserAgent: window.navigator.userAgent
  });

  Utilities.registeredUser = true;
};


// List taken from https://developer.mozilla.org/en-US/docs/Web/HTML/Element
Utilities.whiteListTags = {
  // Basic elements
  'html': true,

  // Document metadata
  'base': false, 'head': false, 'link': false, 'meta': false, 'style': false,
  'title': false,

  // Content sectioning
  'address': true, 'article': true, 'body': true, 'footer': true,
  'header': true, 'h1': true, 'h2': true, 'h3': true, 'h4': true,
  'h5': true, 'h6': true, 'hgroup': true, 'nav': true, 'section': true,

  // Text content
  'dd': true, 'div': true, 'dl': true, 'dt': true, 'figcaption': true,
  'figure': true, 'hr': true, 'li': true, 'main': true, 'ol': true,
  'p': true, 'pre': true, 'ul': true,

  // Inline text semantics
  'a': true, 'abbr': true, 'b': true, 'bdi': true, 'bdo': true, 'br': true,
  'cite': true, 'code': true, 'data': true, 'dfn': true, 'em': true, 'i': true,
  'kbd': true, 'mark': true, 'q': true, 'rp': true, 'rt': true, 'rtc': true,
  'ruby': true, 's': true, 'samp': true, 'small': true, 'span': true,
  'strong': true, 'sub': true, 'sup': true, 'time': true, 'u': true,
  'var': true, 'wbr': true,

  // Image & multimedia
  'area': false, 'audio': false, 'img': false, 'map': false, 'track': false,
  'video': false,

  // embedded content
  'embed': true, 'iframe': true, 'object': true, 'param': true, 'source': true,

  // Scripting
  'canvas': false, 'noscript': false, 'script': false,

  // Edits
  'del': true, 'ins': true,

  // Table content
  'caption': true, 'col': true, 'colgroup': true, 'table': true, 'tbody': true,
  'td': true, 'tfoot': true, 'th': true, 'thead': true, 'tr': true,

  // Forms
  'button': true, 'datalist': true, 'fieldset': true, 'form': true,
  'input': true, 'keygen': true, 'label': true, 'legend': true, 'meter': true,
  'optgroup': true, 'option': true, 'output': true, 'progress': true,
  'select': true, 'textarea': false,

  // Interactive elements
  'details': false, 'dialog': false, 'menu': false, 'menuitem': false,
  'summary': false,

  // Web Components
  'content': false, 'decorator': false, 'element': false, 'shadow': false,
  'template': false,

  // Obsolete and deprecated elements
  'acronym': true, 'applet': true, 'basefont': true, 'big': true, 'blink': true,
  'center': true, 'dir': true, 'frame': true, 'frameset': true, 'isindex': true,
  'listing': true, 'noembed': true, 'plaintext': true, 'spacer': true,
  'strike': true, 'tt': true, 'xmp': true
};

Utilities. blackListAttr = [ 'contenteditable' ];


Utilities.getTextNodesIn = function(node, includeWhitespaceNodes) {
  'use strict';
  var textNodes = [], nonWhitespaceMatcher = /\S/;

  function getTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (includeWhitespaceNodes || nonWhitespaceMatcher.test(node.nodeValue)) {
        textNodes.push(node);
      }
    } else if (node.nodeType === Node.COMMENT_NODE) {
      return;
    } else {
      var tagName = $(node).prop('tagName').toLowerCase();
      if (!Utilities.whiteListTags[tagName] ||
          (tagName === 'span' && $(node).attr('processed') === 'true')) {
        return;
      }

      Utilities.blackListAttr.forEach(function(attr) {
        if ($(node).attr(attr)) {
          return;
        }
      });

      $(node.childNodes).each(function() {
        getTextNodes(this);
      });
    }
  }

  getTextNodes(node);
  return textNodes;
};


Utilities.wrapTextNodesInTagAndAddHandlers = function(tag, handlers) {
  'use strict';
  var textNodes = document.body ? Utilities.getTextNodesIn(document.body) : [];

  $.each(textNodes, function(idx, node) {
    $(node).replaceWith(function() {
      var newNodes = Utilities.escapeHtml(node.nodeValue).replace(
          /(\S+)/g, '<' + tag + '>$1</' + tag + '>');

      newNodes = $.parseHTML(newNodes);
      $(newNodes).each(function() {
        $(this).attr({ style: 'all:unset', processed: 'true' });
        var that = this;
        $.each(handlers, function(key, val) {
          $(that).off(key).on(key, val);
        });
      });

      return newNodes;
    });
  });
};


// navigator.sendBeacon polyfill, code taken from
// https://github.com/miguelmota/Navigator.sendBeacon/blob/master/sendbeacon.js
Utilities.sendBeacon = function(url, data) {
  'use strict';
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, false);
  xhr.setRequestHeader('Accept', '*/*');
  if (typeof data === 'string') {
    xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
    xhr.responseType = 'text/plain';
  } else if (Object.prototype.toString.call(data) === '[object Blob]') {
    if (data.type) {
      xhr.setRequestHeader('Content-Type', data.type);
    }
  }

  xhr.send(data);
  return true;
};
