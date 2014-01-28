(function () {
  var domCache = {};

  var fetch = function() {
    return xhr.getJSON('/cgi-bin/apps');
  };

  var onLogClick = function(app, event) {
    event.preventDefault();
    var customEvent = new CustomEvent('app:showLog', {
      detail: { app: app }
    });
    document.body.dispatchEvent(customEvent);
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
      $lastCommit.innerHTML = gitSyntax('commit '+ app.lastCommitHash + '\n' + app.lastCommit);

      var $appLink = document.createElement('a');
      $appLink.href = app.url;
      $appLink.textContent = 'Go to application';

      var $logLink = document.createElement('a');
      $logLink.href = '#logs-' + app.name;
      $logLink.textContent = 'Show logs';
      $logLink.addEventListener('click', onLogClick.bind(onLogClick, app.name), false);

      $container.appendChild($title);
      $container.appendChild($appLink);
      $container.appendChild(document.createTextNode(' — '));
      $container.appendChild($logLink);
      $container.appendChild($status);
      $container.appendChild($created);
      $container.appendChild($lastCommit);
      domCache.el.appendChild($container);
    });
  };

  // Adds some markup to the git output
  var gitSyntax = function(text) {
    var escaper = document.createElement('div');
    escaper.textContent = text;
    var escaped = escaper.innerHTML;
    return escaped.replace(/^(commit|tree|parent|author|committer) (.*)$/mg,
                           '<span class="git-keyword git-$1">$1</span> $2');
  };


  onReady(function() {
    fetch()
      .then(render)
      .catch(function(error) {
        console.error("Failed getting apps", error);
      });
  });

})();
