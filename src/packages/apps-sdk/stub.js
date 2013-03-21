/*
 * "stub" object that replicates btapp functionality in pure javscript.
 *
 * Copyright(c) 2010 BitTorrent Inc.
 * License: ************
 *
 * Date: %date%
 * Version: %version%
 *
 */

var stub = {
  _torrents: { },
  add: {
    _delay: 1000,
    torrent: function(url) {
      var tor = new bt._objs.Torrent(url);
      var added = function() {
        window.stub._torrents[tor.hash] = tor;
        if ('torrentStatus' in btapp.events._registered) {
          btapp.events._registered.torrentStatus(
            { appid: 'c:\\example\\foo',
              url: url,
              status: 200,
              message: 'success',
              hash: tor.hash,
              state: 1
            });
        }
      };
      setTimeout(added, btapp.add._delay);
    },
    rss_feed: function() { throw Error('Not Implemented') },
    rss_filter: function() { throw Error('Not Implemented') }
  },
  events: {
    _registered: { },
    all: function() { return btapp.events._registered },
    keys: function() { return _.keys(btapp.events._registered); },
    get: function(k) { return btapp.events._registered[k]; },
    set: function(k, v) { btapp.events._registered[k] = v; }
  },
  stash: {
    _get_data: function() {
      return _($.jStorage.get('index', [])).chain().map(function(v) {
        return [v, $.jStorage.get(v)];
      }).reduce({}, function(acc, val) {
        acc[val[0]] = val[1]; return acc }).value();
    },
    _set_data: function(key, value) {
      $.jStorage.set('index', $.jStorage.get('index', []).concat([key]));
      $.jStorage.set(key, value);
    },
    all: function() { return btapp.stash._get_data(); },
    keys: function() { return _.keys(btapp.stash.all()) },
    get: function(k) { return btapp.stash.all()[k]; },
    set: function(k, v) { btapp.stash._set_data(k, v); },
    _clear: function() { $.jStorage.flush(); }
  },
  torrent: {
    // Move all properties into the actual object.
    all: function() { return btapp._torrents; },
    keys: function() { return _.keys(btapp._torrents) },
    get: function(k) { return btapp._torrents[k]; },
    add: function(k) { return stub.add.torrent(k); },
    remove: function(k) { return stub.torrent.get(k).remove(); }
  },
  resource: function(url) {
    var response;
    $.ajax({
      url: url,
      success: function(v) { response = v; },
      async: false
    });
    return response;
  },
  rss_feed: {
    all: function() { throw Error('Not Implemented') },
    keys: function() { throw Error('Not Implemented') },
    get: function(k) { throw Error('Not Implemented') },
    add: function(k) { return stub.add.rss_feed(k); },
    remove: function(k) { return stub.rss_feed.get(k).remove(); }
  },
  rss_filter: {
    all: function() { throw Error('Not Implemented') },
    keys: function() { throw Error('Not Implemented') },
    get: function(k) { throw Error('Not Implemented') }
  },
  settings: {
    all: function() { throw Error('Not Implemented') },
    keys: function() { throw Error('Not Implemented') },
    get: function(k) { throw Error('Not Implemented') },
    set: function(k, v) { throw Error('Not Implemented') }
  },
  log: function() { console.log.apply(this, arguments) },
  language: {
    all: function() {
      return (navigator.language ||
              navigator.systemLanguage).toLowerCase().substr(0, 2) }
  }
};
