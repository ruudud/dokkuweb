(function () {

  var domCache = {};

  var fetch = function() {
    return xhr.getJSON('/cgi-bin/keys');
  };

  var appendKey = function (fingerprint, $container) {
    var $key = document.createElement('li');

    var $listIcon = document.createElement('span');
    $listIcon.className = 'anim-unlock icon-key';
    $key.appendChild($listIcon);

    var $keyText = document.createTextNode(' ' + fingerprint);
    $key.appendChild($keyText);

    $container.appendChild($key);
  };

  var render = function(keys) {
    $el = document.getElementById('keys');

    var $container = document.createElement('ul');
    $container.className = 'list-group';
    keys.forEach(function(fingerprint) {
      appendKey(fingerprint, $container);
    });

    $el.appendChild($container);
    domCache.keyList = $container;
  };


  document.addEventListener('DOMContentLoaded', function() {
    fetch()
      .then(render)
      .catch(function(error) {
        console.error("Failed getting keys", error);
      });
  });

  document.body.addEventListener('key:add', function(event) {
    appendKey(event.detail.fingerprint, domCache.keyList);
  });
})()
