/*jshint browser:true*/
/*global xhr*/
(function() {
  'use strict';

  var BASEURL = '/cgi-bin/config';

  var createInput = function(value, disabled) {
    var $el = document.createElement('input');
    $el.setAttribute('type', 'text');
    $el.setAttribute('value', value);
    if (disabled) {
      $el.setAttribute('disabled', 'disabled');
    }
    return $el;
  };

  var ConfigView = function(id, $el) {
    this.id = id;
    this.$el = $el;
    this._url = BASEURL + '?app=' + id;
  };
  ConfigView.prototype.fetch = function() {
    return xhr.getJSON(this._url);
  };
  ConfigView.prototype.render = function(config) {

    this.$el.innerHTML = '';
    var $container = document.createElement('ul');
    for (var key in config) {
      var $configLine = this._createConfigRow(key, config[key]);
      $container.appendChild($configLine);
    }
    this.$el.appendChild($container);

  };
  ConfigView.prototype.start = function() {
    this.fetch()
        .then(this.render.bind(this))
        .catch(this._fetchError.bind(this));
  };
  ConfigView.prototype.deleteConfig = function(key) {
    return xhr.delete(this._url + '&key=' + key)
              .then(this.start.bind(this));
  };
  ConfigView.prototype._createConfigRow = function(key, value) {
    var $configRow = document.createElement('li');
    $configRow.className = 'row';

    var $key = document.createElement('div');
    $key.textContent = key;

    var $input = document.createElement('div');
    $input.className = 'postfixed-input';

    var $value = createInput(value, true);

    var $remove = document.createElement('button');
    $remove.innerHTML = '<span class="icon-close"></span>';
    $remove.addEventListener('click', this.deleteConfig.bind(this, key), false);

    $input.appendChild($value);
    $input.appendChild($remove);

    $configRow.appendChild($key);
    $configRow.appendChild($input);
    return $configRow;
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
