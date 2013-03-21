/*
 * Conveniently forward all jquery xhr requests through the dev server when in
 * develop mode.
 *
 * Copyright(c) 2010 BitTorrent Inc.
 *
 */

$(document).ready(function() {
  // Taken directly from jquery's ajax.js
  var rurl = /^(\w+:)?\/\/([^\/?#]+)/;

  function swap_location(xhr, settings) {
    var url = settings.url.split('#').length > 1 ?
      settings.url.split('#').slice(-1) : '';
    if (url) xhr.setRequestHeader('x-location', url);
  };

  if (window.develop) {
    $.ajax = _.wrap($.ajax, function(fn) {
      var args = _.rest(arguments);
      var settings = args[0];
      var parts = rurl.exec( settings.url );
      var remote = parts && (parts[1] && parts[1] !== location.protocol ||
                             parts[2] !== location.host)
      if (remote) {
        settings.url = sprintf('/?_=%s#%s', (new Date()).getTime(),
                               settings.url);
      }
      return fn.apply(this, args);
    });

    $.ajaxSetup({ beforeSend: swap_location });
  }
});
