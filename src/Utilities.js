function Utilities() {
}

Utilities.buffer = [];


Utilities.getRandomToken = function() {
  // E.g. 8 * 32 = 256 bits token
  var randomPool = new Uint8Array(32);
  crypto.getRandomValues(randomPool);
  var hex = '';
  for (var i = 0; i < randomPool.length; ++i) {
    hex += randomPool[i].toString(16);
  }
  // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
  return hex;
}


Utilities.getUserId = function(callback) {
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


Utilities.logMessage = function(msg) {
  Utilities.getUserId(function(UserId) {
    console.log(UserId + ' ' + Date.now() + ' ' + msg);
  });
};


Utilities.phoneHome = function(data, cb) {
  if (!Array.isArray(data)) {
    data = [data];
  }

  chrome.runtime.sendMessage({
    action: 'beacon',
    url: Settings.Endpoint,
    data: data
  }, cb);
};


Utilities.sendObject = function(obj) {
  obj['Timestamp'] = Date.now();
  Utilities.getUserId(function(UserId) {
    obj['UserId'] = UserId;
    Utilities.phoneHome(obj);
  });
};


Utilities.logObject = function(obj) {
  obj['Timestamp'] = Date.now();
  Utilities.getUserId(function(UserId) {
    obj['UserId'] = UserId;
    Utilities.buffer.push(obj);
  });
};


Utilities.sendBuffer = function() {
  Utilities.phoneHome(Utilities.buffer, function(success) {
    if (success) {
      Utilities.buffer.length = 0;
    }
  })
};


Utilities.addHandlerToAnchors = function() {
  // Register Click Handlers on Links
  $('a').click(function() {
    Utilities.sendObject({
      'Event': 'Click',
      'CurrURL': window.location.href,
      'PageX': event.pageX,
      'PageY': event.pageY,
      'Link': this.href,
      'Text': this.text
    });
  });
};


Utilities.getTextNodesIn = function(node, includeWhitespaceNodes) {
  var textNodes = [], nonWhitespaceMatcher = /\S/;

  function getTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (includeWhitespaceNodes || nonWhitespaceMatcher.test(node.nodeValue)) {
        textNodes.push(node);
      }
    } else {
      for (var i = 0, len = node.childNodes.length; i < len; ++i) {
        getTextNodes(node.childNodes[i]);
      }
    }
  }

  getTextNodes(node);
  return textNodes;
};

Utilities.wrapTextNodesInTag = function(tag, split) {
  if (split == null) {
    split = true;
  }

  var bodyEl = document.getElementsByTagName('body')[0];
  var textNodes = Utilities.getTextNodesIn(bodyEl);

  $.each(textNodes, function(idx, node) {
    if (split) {
      $(node).replaceWith(
          node.nodeValue.replace(/(\S+)/g, '<' + tag + '>$1</' + tag + '>'));
    } else {
      $(node).wrap('<' + tag + '/>');
    }
  });
};

Utilities.logHoverEventOnTags = function(tag) {
  $(tag).mouseenter(
      function(event) {
        Utilities.logObject({
          'Event': 'Hover',
          'URL': window.location.href,
          'Text': $(this).text(),
          'PageX': event.pageX,
          'PageY': event.pageY
        });
      });
};

// navigator.sendBeacon polyfill, code taken from
// https://github.com/miguelmota/Navigator.sendBeacon/blob/master/sendbeacon.js
Utilities.sendBeacon = function(url, data) {
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
