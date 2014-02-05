(function() {

  var EnvironmentView = function(id, $el) {
    this.id = id;
    this.$el = $el;
  };
  EnvironmentView.prototype.start = function() {
    this.fetch()
        .then(this.render.bind(this))
        .catch(this._fetchError.bind(this));
  };
  EnvironmentView.prototype.fetch = function() {
    return xhr.get('/cgi-bin/environment?app=' + this.id);
  };
  EnvironmentView.prototype.render = function(rawEnv) {
    var $dl = document.createElement('dl');
    JSON.parse(rawEnv, function (k, v) { 
        if (k === "") { return null; }
        var $dt = document.createElement('dt');
        var $dd = document.createElement('dd');
        $dt.textContent = k;
        $dd.textContent = v;
        $dl.appendChild($dt);
        $dl.appendChild($dd);
        return v; 
    });
    this.$el.innerHTML = '';
    this.$el.appendChild($dl);
  };
  EnvironmentView.prototype._fetchError = function(error) {
    console.error("Error when getting environment variables for app " + this.id, error);
  };

  var showEnvironment = function (event) {
      console.log('lols', event);
     var envView = new EnvironmentView(event.detail.app, event.detail.el);
     envView.start();
  };

  document.body.addEventListener('app:showEnv', showEnvironment);
})();
