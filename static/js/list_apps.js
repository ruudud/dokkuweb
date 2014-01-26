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
      var healthy = app.status && app.status.indexOf('Up ') > -1;

      var $container = document.createElement('article');
      $container.className = 'striped';

      var $title = document.createElement('h3');
      $title.textContent = app.name + ' ';

      var statusCss = healthy ? 'anim-pulse icon-sun'
                              : 'anim-shake icon-rain';
      var $statusIcon = document.createElement('span');
      $statusIcon.className = statusCss;
      $title.appendChild($statusIcon);

      var $status = document.createElement('p');
      $status.textContent = 'Status: ' + app.status;

      var $created = document.createElement('p');
      $created.textContent = 'Created ' + app.created;

      var $lastCommit = document.createElement('pre');
      $lastCommit.className = 'commit-info';
      $lastCommit.textContent = 'commit '+ app.lastCommitHash + '\n' + app.lastCommit;

      var $link = document.createElement('a');
      $link.href = app.url;
      $link.textContent = 'Go to application';

      $container.appendChild($title);
      $container.appendChild($link);
      $container.appendChild($status);
      $container.appendChild($created);
      $container.appendChild($lastCommit);
      domCache.el.appendChild($container);
    });
  };

  document.addEventListener('DOMContentLoaded', function() {
    fetch()
      .then(render)
      .catch(function(error) {
        console.error("Failed getting apps", error);
      });
  });

})()
