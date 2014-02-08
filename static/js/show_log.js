/*jshint browser:true*/
/*global xhr*/
(function() {
  'use strict';
  var FETCH_INTERVAL = 5000;

  var LogView = function(id, $el) {
    this.id = id;
    this.$el = $el;
    this._bindEvents();
  };
  LogView.prototype.start = function() {
    this.fetch()
        .then(this.render.bind(this))
        .then(this.autoFetch.bind(this))
        .catch(this._fetchError.bind(this));
  };
  LogView.prototype.fetch = function() {
    return xhr.get('/cgi-bin/logs?app=' + this.id);
  };
  LogView.prototype.render = function(log) {
    this.$el.textContent = log;
  };
  LogView.prototype.autoFetch = function() {
    this._fetchIntervalId = window.setInterval(function() {
      this.fetch()
        .then(this.render.bind(this))
        .catch(this._fetchError.bind(this));
    }.bind(this), FETCH_INTERVAL);
  };
  LogView.prototype._stopAutoFetch = function() {
    window.clearInterval(this._fetchIntervalId);
  };
  LogView.prototype._fetchError = function(error) {
    console.error("Error when getting logs for app " + this.id, error);
  };
  LogView.prototype._bindEvents = function() {
    document.body.addEventListener('app:hideLog:' + this.id,
                                   this._stopAutoFetch.bind(this));
  };

  var showLog = function (event) {
     var logView = new LogView(event.detail.app, event.detail.el);
     logView.start();
  };

  document.body.addEventListener('app:showLog', showLog);
})();
