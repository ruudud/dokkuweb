(function() {

  var FETCH_INTERVAL = 5000;

  var domCache = {};
  var logfetcher;
  var currentApp;

  var fetch = function (app) {
    return xhr.get('/cgi-bin/logs?app=' + app);
  };

  var startAutoFetcher = function () {
    logfetcher = window.setInterval(function () {
      fetch(currentApp)
        .then(render)
        .catch(function(error) {
          console.error("Failed getting logs for app", error);
        });
    }, FETCH_INTERVAL);
  };

  var render = function (log) {
    if (!domCache.modal) {
        domCache.modal = document.getElementById('modal');
        domCache.modalContent = domCache.modal.children[0];

        registerCloseHandler(domCache.modal.children[0].children[0]);
        registerCloseHandler(domCache.modal);
    }
    domCache.modalContent.children[1].textContent = log;
    domCache.modal.style.display = 'block';
  };

  var registerCloseHandler = function ($el) {
    $el.addEventListener('click', function (event) {
      if (event.target === domCache.modalContent) {
          return;
      }
      window.clearTimeout(logfetcher);
      $el.style.display = 'none';
    });
  };

  var showLog = function (event) {
     var app = event.detail.app;
     currentApp = app;
     fetch(app)
       .then(render)
       .then(startAutoFetcher)
       .catch(function(error) {
         console.error("Failed getting logs for app", error);
       });
  };

  document.body.addEventListener('app:showLog', showLog);
})()
