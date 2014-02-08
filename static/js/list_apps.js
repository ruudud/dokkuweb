/*jshint browser:true*/
/*global xhr, onReady*/
(function () {
  'use strict';
  var domCache = {};

  var fetch = function() {
    return xhr.getJSON('/cgi-bin/apps');
  };

  var sendHideLogEvent = function(app) {
    var hideLogEvent = new CustomEvent('app:hideLog:' + app);
    document.body.dispatchEvent(hideLogEvent);
  };

  var onCommitClick = function(app, event) {
    sendHideLogEvent(app);
  };

  var onLogClick = function(app, $container, event) {
    var $el = $container.querySelector('.js-log-content');
    var showLogEvent = new CustomEvent('app:showLog', {
      detail: { app: app, el: $el }
    });
    document.body.dispatchEvent(showLogEvent);
  };

  var onConfigClick = function(app, $container, event) {
    sendHideLogEvent(app);
    var $el = $container.querySelector('.js-config-content');
    var showConfigEvent = new CustomEvent('app:showConfig', {
      detail: { app: app, el: $el }
    });
    document.body.dispatchEvent(showConfigEvent);
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
      $logContainer.innerHTML = '<div class="tab-content"><pre class="js-log-content">Fetching…</pre></div>';
      $logSection.appendChild($logContainer);
      $logSection.querySelector('label')
                 .addEventListener('click',
                                   onLogClick.bind(onLogClick, app.name, $logContainer),
                                   false);

      var $configSection = document.createElement('section');
      $configSection.className = 'tab';
      $configSection.innerHTML = '<input type="radio" id="config-' + app.name + '" name="' + app.name + '">'
        + '<label for="config-' + app.name + '">Config</label>';
      var $configContainer = document.createElement('div');
      $configContainer.className = 'tab-panel';
      $configContainer.innerHTML = '<div class="tab-content js-config-content">Fetching…</div>';
      $configSection.appendChild($configContainer);
      $configSection.querySelector('label')
                 .addEventListener('click',
                                   onConfigClick.bind(onConfigClick, app.name, $configContainer),
                                   false);

      var $appLinkSection = document.createElement('section');
      $appLinkSection.className = 'tab';
      $appLinkSection.innerHTML = '<a href="' + app.url + '" class="app-link">Go to</a>'
                                + '<span class="anim-push icon-right"></span>';

      $appInfo.appendChild($commitSection);
      $appInfo.appendChild($logSection);
      $appInfo.appendChild($configSection);
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
