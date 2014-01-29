(function() {

  var FETCH_INTERVAL = 5000;

  var logfetcher;

  var fetch = function (app) {
    return xhr.get('/cgi-bin/logs?app=' + app);
  };

  var startAutoFetcher = function (app) {
    // Disabled for now..
    // TODO: Create an object per app that can hold state
    logfetcher = window.setInterval(function () {
      fetch(app)
        .then(render)
        .catch(function(error) {
          console.error("Failed getting logs for app", error);
        });
    }, FETCH_INTERVAL);
  };

  var render = function ($el, log) {
    console.log('render', arguments);
    $el.textContent = log;
  };

  var showLog = function (event) {
     var app = event.detail.app;
     var $el = event.detail.el;
     console.log(event);
     fetch(app)
       .then(render.bind(null, $el))
       //.then(startAutoFetcher.bind(null, app))
       .catch(function(error) {
         console.error("Failed getting logs for app", error);
       });
  };

  document.body.addEventListener('app:showLog', showLog);
})();
