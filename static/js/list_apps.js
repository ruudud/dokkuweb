(function () {

  var domCache = {};

  var fetch = function() {
    return xhr.getJSON('/cgi-bin/apps');
  };

  var render = function(apps) {
    if (!domCache.el) {
      domCache.el = document.getElementById('apps');
    }
    apps.forEach(function(app) {
      var $el = document.createElement('article');
      $el.className = 'app';

      var $title = document.createElement('h3');
      $title.textContent = app;

      $container.appendChild($title);
      domCache.el.appendChild($el);
    });
  };

  document.addEventListener('DOMContentLoaded', function() {
    fetch()
      .then(render)
      .catch(function(error) {
        console.error("Failed getting apps!", error);
      });
  });

})()
