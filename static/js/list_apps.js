(function () {
  var domCache = {};

  var fetch = function() {
    return xhr.getJSON('/cgi-bin/apps');
  };

  var onLogClick = function(app, $container, event) {
    console.log('log click', app);
    var $el = $container.querySelector('.js-log-content');
    var customEvent = new CustomEvent('app:showLog', {
      detail: { app: app, el: $el }
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

      var $title = document.createElement('h3');
      $title.textContent = app.name + ' ';

      var statusCss = healthy ? 'anim-pulse icon-sun'
                              : 'anim-shake icon-rain';
      var $statusIcon = document.createElement('span');
      $statusIcon.className = statusCss;
      $title.appendChild($statusIcon);

      var $status = document.createElement('div');
      $status.className = 'app-status';
      $status.textContent = 'Created ' + app.created + ', Status: ' + app.status;

      var $appInfo = document.createElement('div');
      $appInfo.className = 'tabs';

      var $commitSection = document.createElement('section');
      $commitSection.className = 'tab';
      $commitSection.innerHTML = '<input type="radio" id="commit-' + app.name + '" name="' + app.name + '" checked>'
        + '<label for="commit-' + app.name + '">Last commit</label>';

      var $commitPanel = document.createElement('div');
      $commitPanel.className = 'tab-panel';
      var $commitContainer = document.createElement('div');
      $commitContainer.className = 'tab-content';
      var $commit = document.createElement('pre');
      $commit.className = 'commit-info';
      $commit.innerHTML = gitSyntax('commit '+ app.lastCommitHash + '\n' + app.lastCommit);
      $commitContainer.appendChild($commit);

      $commitPanel.appendChild($commitContainer);
      $commitSection.appendChild($commitPanel);

      var $logSection = document.createElement('section');
      $logSection.className = 'tab';
      $logSection.innerHTML = '<input type="radio" id="log-' + app.name + '" name="' + app.name + '">'
        + '<label for="log-' + app.name + '">Show log</label>';
      var $logContainer = document.createElement('div');
      $logContainer.className = 'tab-panel';
      $logContainer.innerHTML = '<div class="tab-content"><pre class="js-log-content log-info">Fetching log…</pre></div>';
      $logSection.appendChild($logContainer);
      $logSection.querySelector('label')
                 .addEventListener('click',
                                   onLogClick.bind(onLogClick, app.name, $logContainer),
                                   false);

      var $appLinkSection = document.createElement('section');
      $appLinkSection.className = 'tab';
      $appLinkSection.innerHTML = '<a href="' + app.url + '">Go to application →</a>';

      $appInfo.appendChild($commitSection);
      $appInfo.appendChild($logSection);
      $appInfo.appendChild($appLinkSection);

      $container.appendChild($title);
      $container.appendChild($status);
      $container.appendChild($appInfo);
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
