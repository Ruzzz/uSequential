/*
 * Base of the bt convenience object for creating apps.
 *
 * Copyright(c) 2010 BitTorrent Inc.
 *
 */

if (typeof(bt) == 'undefined') window.bt = {};

_.extend(bt, {
  _tor: {
    removed: -1,
    failed: 0,
    added: 1,
    complete: 2
  },
  _objs: {},
  _templates: {},
  add: {
    torrent: function(url, defaults, cb) {
      /*
       * Parameters:
       *     url - URL to add the torrent from
       *     defaults(optional) - The defaults to set the torrent to.
       *     cb - A callback to call after the torrent has been added.
       */
      // Shift arguments if defaults is omited
      if (_.isFunction(defaults) || _.isUndefined(defaults)) {
        cb = defaults;
        defaults = { };
      }

      var setter = function(resp) {
        if (resp.state != bt._tor.added)
          return resp;
        var tor = bt.torrent.get(resp.url);
        _.each(defaults, function(v, k) {
          tor.properties.set(k, v);
        });
        return resp;
      };

      bt._handlers._torrents[url] = cb ? _.compose(cb, setter) : setter;
      return btapp.add.torrent(url);
    },
    rss_feed: function(url) {
      return btapp.add.rss_feed(url);
    },
    rss_filter: function(name) {
      return btapp.add.rss_filter(name);
    }
  },
  stash: {
    all: function() {
      var everything = btapp.stash.all();
      _.each(everything, function(v, k) {
        try {
          everything[k] = JSON.parse(v);
        } catch(err) { }
      });
      return everything;
    },
    keys: function() { return btapp.stash.keys() },
    get: function(k, d) {
      try {
        return JSON.parse(btapp.stash.get(k));
      } catch(err) {
        if (d == null && d !== null)
          throw err;
        return d;
      } },
    set: function(k, v) { btapp.stash.set(k, JSON.stringify(v)); }
  },
  events: {
    all: function() { return btapp.events.all(); },
    keys: function() { return btapp.events.keys(); },
    get: function(k) { return btapp.events.get(k); },
    set: function(k, v) { return btapp.events.set(k, v); }
  },
  torrent: {
    // Move all properties into the actual object.
    all: function() { return btapp.torrent.all() },
    keys: function() { return btapp.torrent.keys() },
    get: function(key) {
      // Get by download url or hash
      if (key.match(/http(|s)|magnet\:/)) {
        var matches = _(bt.torrent.all()).chain().values().filter(function(v) {
          return v.properties.get('download_url') == key;
        }).value();
        return matches.length > 0 ? matches[0] : undefined;
      }
      return btapp.torrent.get(key);
    },
    add: function(url, defaults, cb) {
      return bt.add.torrent(url, defaults, cb);
    },
    remove: function(id) {
      var t = bt.torrent.get(id);
      if (t) {
        return t.remove();
      }
      else {
        throw Error(sprintf('Remove failed on nonexistent torrent %s.', id));
      }
    }
  },
  _handlers: {
    _torrents: { },
    torrent: function(resp) {
      /*
       * resp.state -
       *    -1 - removed
       *     0 - not added
       *     1 - added, started
       *     2 - completed
       */
      if (resp.url in bt._handlers._torrents)
        bt._handlers._torrents[resp.url](resp);
    }
  },
  rss_feed: {
    all: function() { return btapp.rss_feed.all() },
    keys: function() { return btapp.rss_feed.keys() },
    get: function(k) { return btapp.rss_feed.get(k) },
    add: function(url, defaults, cb) {
      return bt.add.rss_feed(url, defaults, cb);
    },
    remove: function(id) {
      var r = bt.rss_feed.get(id);
      if (r) {
        return r.remove();
      }
      else {
        throw Error(sprintf('Remove failed on nonexistent rss feed %s.', id));
      }
    }
  },
  rss_filter: {
    all: function() { return btapp.rss_filter.all() },
    keys: function() { return btapp.rss_filter.keys() },
    get: function(k) { return btapp.rss_filter.get(k) }
  },
  resource: function(v) {
    return btapp.resource(v);
  },
  settings: {
    all: function() { return btapp.settings.all() },
    keys: function() { return btapp.settings.keys() },
    get: function(k) { return btapp.settings.get(k) },
    set: function(k, v) { btapp.settings.set(k, v) }
  },
  log: function() {
    if (btapp.log == undefined)
      return btapp.log(JSON.stringify(_.map(arguments, function(v) { return v })));
    return btapp.log.apply(this, arguments);
  },
  language: {
    all: function() { return btapp.language.all() }
  },
  template: function(tmpl_name, vals) {
      /*
       * Parameters:
       *     tmpl_name - The name of the file containing the template you'd
       *                 like to use.
       *     vals - key, value pairs to replace in the template itself
       *
       */
    if (!(tmpl_name in bt._templates))
      bt._templates[tmpl_name] = _.template(bt.resource(
        sprintf('html/%s.html', tmpl_name)));
    return bt._templates[tmpl_name](vals);
  }
});

(function() {
  // If there isn't a console, default to bt.log
  if (!window.console)
    window.console = { log: bt.log };

  $(document).ready(function() {
    if (window.debug) {
      firebug.env.height = 250;
    }

    window.client = window.btapp ? true : false;
    // If btapp exists, this is running natively, so don't replace anything.
    if (!window.btapp) {
      window.develop = true;
      window.btapp = stub;
    }

    // Setup the event handler for torrents that allows passing callbacks in to
    // monitor state.
    bt.events.set('torrentStatus', bt._handlers.torrent);

    // Take html/index.html and set the entire content to the body.
    $("body").html(bt.resource('html/main.html'));
  });
})();

