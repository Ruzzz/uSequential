/*
 * Copyright(c) 2010 BitTorrent Inc.
 * License: ************
 *
 * Date: %date%
 * Version: %version%
 *
 */

if (typeof(bt) == 'undefined') window.bt = {};
if (typeof(bt._objs) == 'undefined') window.bt._objs = {};

_.extend(bt._objs, { Properties: Class.extend({
  init: function() {
    this._props = { };
  },
  all: function() { return this._props; },
  keys: function() { return _.keys(this._props); },
  get: function(k) {
    var v = this._props[k];
    if (v == undefined)
      throw Error('Unknown property ' + k);
    return v;
  },
  set: function(k, v) { this._props[k] = v; }
})});

_.extend(bt._objs, { Torrent: Class.extend({
  init: function(url) {
    this.properties = new bt._objs.Properties();
    this.properties.set('download_url', url);
    this.hash = this._sha();
    this.properties.set('hash', this.hash);
    this._set_props();
    this.file._files = { };
    this.file.set('1', new bt._objs.File(1, this));
  },
  _set_props: function() {
    var default_props = { progress: 0,
                          name: 'default',
                          label: '',
                          trackers: [],
                          eta: 0,
                          remaining: 0 };
    for (var i in default_props) {
      this.properties.set(i, default_props[i]);
    }
  },
  _sha: function() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
    var len = 40;
    var hash = '';
    for (var i=0; i < len; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  },
  file: {
    all: function() { return this._files; },
    keys: function() { return _.keys(this._files); },
    get: function(k) {
      var v = this._files[k];
      if (v == undefined)
        throw Error('Unknown property ' + k);
      return v;
    },
    set: function(k, v) { this._files[k] = v; }
  },
  peer: {
    all: function() { throw Error('Not Implemented') },
    keys: function() { throw Error('Not Implemented') },
    get: function(k) { throw Error('Not Implemented') },
    set: function(k, v) { throw Error('Not Implemented') }
  },
  start: function(force) { throw Error('Not Implemented') },
  stop: function() { throw Error('Not Implemented') },
  pause: function() { throw Error('Not Implemented') },
  unpause: function() { throw Error('Not Implemented') },
  recheck: function() { throw Error('Not Implemented') },
  remove: function() { delete stub._torrents[this.hash]; }
})});

_.extend(bt._objs, { File: Class.extend({
  init: function(index, parent) {
    this.index = index;
    this.torrent = parent;
    this.properties = new bt._objs.Properties();
    this.properties.set('index', index);
    this.properties.set('size',  Math.floor(Math.random() * 1024));
  },
  open: function() {
    console.log("Opening file ...");
    return false;
  }
})});
