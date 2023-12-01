(function (window, document) {
  "use strict";

  var supportedBrowser = document.querySelector && window.addEventListener;

  if (!supportedBrowser) {
    console.log(
      "Wordpress <iframe> limit is still present because the browser is not supported."
    );
    console.log(
      "For more information: https://medium.com/@wlarch/overwrite-and-bypass-wordpress-iframe-height-dimension-limit-using-javascript-9d5035c89e37"
    );
    return;
  }

  var debounceTimeout = 200;
  var timeoutIDs = {};
  var heightsByIDs = {};

  window.aalEmbed = window.aalEmbed || {};

  if (window.aalEmbed.OverwriteIframeHeightLimit) {
    return;
  }

  window.aalEmbed.OverwriteIframeHeightLimit = function (e) {
    var data = e.data;

    if (
      !(data.secret || data.message || data.value) ||
      /[^a-zA-Z0-9]/.test(data.secret) ||
      "height" !== data.message
    ) {
      return;
    }

    var iframes = document.querySelectorAll(
      'iframe.components-sandbox, iframe[data-secret="' +
        data.secret +
        '"], iframe.aal-unit-preview-frame'
    );

    for (var i = 0; i < iframes.length; i++) {
      var thisFrame = iframes[i];

      if (
        e.source !== thisFrame.contentWindow &&
        e.source.parent !== thisFrame.contentWindow
      ) {
        continue;
      }

      var iHeight = parseInt(data.value, 10);
      var attrID =
        thisFrame.getAttribute("id") || "iframe-" + data.secret + "-" + i;
      var eventAdjustIFrameHeight = new CustomEvent("receivedIframeMessage", {
        detail: {
          number: i,
          height: iHeight,
          id: attrID,
          source: thisFrame,
          data: data,
          isSandbox: e.source.parent === thisFrame.contentWindow,
        },
      });

      window.dispatchEvent(eventAdjustIFrameHeight);
    }
  };

  window.addEventListener(
    "message",
    window.aalEmbed.OverwriteIframeHeightLimit,
    false
  );
  window.addEventListener(
    "receivedIframeMessage",
    debounceCallbackForEvent(adjustFrameHeight)
  );

  function adjustFrameHeight(event) {
    var attrID = event.detail.id;
    var iHeight = event.detail.height;
    var source = event.detail.source;
    var secret = event.detail.data.secret;

    source.setAttribute("id", attrID);
    source.setAttribute("height", iHeight.toString());
    source.classList.add("aal-adjusted-height");

    if (event.detail.isSandbox) {
      source.setAttribute("scrolling", "no");
      var innerIframe = source.contentWindow.document.querySelector(
        'iframe[data-secret="' + secret + '"]'
      );

      if (innerIframe !== null) {
        innerIframe.setAttribute("height", iHeight.toString());
      }
    }

    var css =
      "#" + attrID + " { height: " + iHeight + "px; overflow: hidden;  } ";
    var styleElem = document.getElementById(
      "aal-embed-style-" + secret + "-" + event.detail.number
    );

    if (styleElem) {
      styleElem.innerHTML = css;
      return;
    }

    var head = document.head || document.getElementsByTagName("head")[0];
    var style = document.createElement("style");

    style.type = "text/css";
    style.id = "aal-embed-style-" + secret + "-" + event.detail.number;
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
  }

  function debounceCallbackForEvent(func, timeout) {
    var timeout = timeout || debounceTimeout;

    return function () {
      var scope = this;
      var args = arguments;
      var event = args[0];

      if (event.detail.height === heightsByIDs[event.detail.number]) {
        return;
      }

      clearTimeout(timeoutIDs[event.detail.number]);
      heightsByIDs[event.detail.number] = event.detail.height;

      timeoutIDs[event.detail.number] = setTimeout(function () {
        func.apply(scope, Array.prototype.slice.call(args));
      }, timeout);
    };
  }
})(window, document);
