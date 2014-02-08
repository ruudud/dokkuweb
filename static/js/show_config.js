/*jshint browser:true*/
/*global xhr*/
(function() {
  'use strict';
  var createInput = function(value, disabled) {
    var $el = document.createElement('input');
    $el.setAttribute('type', 'text');
    $el.setAttribute('value', value);
    if (disabled) {
      $el.setAttribute('disabled', 'disabled');
    }
    return $el;
  };

  var createConfigRow = function(key, value) {
    var $configRow = document.createElement('li');
    $configRow.innerHTML = '<span class="icon-remove"></span>';
    var $key = createInput(key, true);
    var $value = createInput(value, false);

    $configRow.appendChild($key);
    $configRow.appendChild($value);
    return $configRow;
  };

  var ConfigView = function(id, $el) {
    this.id = id;
    this.$el = $el;
  };
  ConfigView.prototype.fetch = function() {
    return xhr.getJSON('/cgi-bin/config?app=' + this.id);
  };
  ConfigView.prototype.render = function(config) {
    this.$el.innerHTML = '';
    var $container = document.createElement('ul');
    for (var key in config) {
      var $configLine = createConfigRow(key, config[key]);
      $container.appendChild($configLine);
    }
    this.$el.appendChild($container);

  };
  ConfigView.prototype.start = function() {
    this.fetch()
        .then(this.render.bind(this))
        .catch(this._fetchError.bind(this));
  };
  ConfigView.prototype._fetchError = function(error) {
    console.error("Error when getting configs for app " + this.id, error);
  };

  var showConfig = function (event) {
     var configView = new ConfigView(event.detail.app, event.detail.el);
     configView.start();
  };
  document.body.addEventListener('app:showConfig', showConfig);
})();
