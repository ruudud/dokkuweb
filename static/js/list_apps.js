(function () {
  var domCache = {};

  var fetch = function() {
    return xhr.getJSON('/cgi-bin/apps');
  };

  var onCommitClick = function(app, event) {
    var hideLogEvent = new CustomEvent('app:hideLog:' + app);
    document.body.dispatchEvent(hideLogEvent);
  };

  var onEnvClick = function(app, $container, event) {
    var $el = $container.querySelector('.js-env-content');
    var showEnvEvent = new CustomEvent('app:showEnv', {
      detail: { app: app, el: $el }
    });
    document.body.dispatchEvent(showEnvEvent);
  };

  var onLogClick = function(app, $container, event) {
    var $el = $container.querySelector('.js-log-content');
    var showLogEvent = new CustomEvent('app:showLog', {
      detail: { app: app, el: $el }
    });
    document.body.dispatchEvent(showLogEvent);
  };

  var render = function(apps) {
    if (!domCache.el) {
      domCache.el = document.getElementById('apps');
    }
    apps.forEach(function(app) {
      var healthy = app.status && app.status.indexOf('Up ') > -1;

      var $container = document.createElement('article');

      var $title = document.createElement('h3');
      $title.className = 'app-title';
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
      $commit.innerHTML = gitSyntax('commit '+ app.lastCommitHash + '\n' + app.lastCommit);
      $commitContainer.appendChild($commit);

      $commitPanel.appendChild($commitContainer);
      $commitSection.appendChild($commitPanel);
      $commitSection.querySelector('label')
           .addEventListener('click',
                             onCommitClick.bind(onCommitClick, app.name),
                             false);

      var $logSection = document.createElement('section');
      $logSection.className = 'tab';
      $logSection.innerHTML = '<input type="radio" id="log-' + app.name + '" name="' + app.name + '">'
        + '<label for="log-' + app.name + '">Show log</label>';
      var $logContainer = document.createElement('div');
      $logContainer.className = 'tab-panel';
      $logContainer.innerHTML = '<div class="tab-content"><pre class="js-log-content">Fetching log…</pre></div>';
      $logSection.appendChild($logContainer);
      $logSection.querySelector('label')
                 .addEventListener('click',
                                   onLogClick.bind(onLogClick, app.name, $logContainer),
                                   false);

      var $envSection = document.createElement('section');
      $envSection.className = 'tab';
      $envSection.innerHTML = '<input type="radio" id="env-' + app.name + '" name="' + app.name + '">'
        + '<label for="env-' + app.name + '">Show env</label>';
      var $envContainer = document.createElement('div');
      $envContainer.className = 'tab-panel';
      $envContainer.innerHTML = '<div class="tab-content js-env-content">Fetching environment variables…</div>';
      $envSection.appendChild($envContainer);
      $envSection.querySelector('label')
                 .addEventListener('click',
                                   onEnvClick.bind(onEnvClick, app.name, $envContainer),
                                   false);

      var $appLinkSection = document.createElement('section');
      $appLinkSection.className = 'tab';
      $appLinkSection.innerHTML = '<a href="' + app.url + '" class="app-link">Visit app</a>'
                                + '<span class="anim-push icon-right"></span>';

      $appInfo.appendChild($commitSection);
      $appInfo.appendChild($logSection);
      $appInfo.appendChild($envSection);
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
