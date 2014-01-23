(function () {

  var domCache = {};

  var fetch = function() {
    return xhr.getJSON('/cgi-bin/keys');
  };

  var render = function(keys) {
    if (!domCache.el) {
      domCache.el = document.getElementById('keys');
    }
    var $container = document.createElement('ul');
    $container.className = 'list-group';
    keys.forEach(function(key) {
      var $key = document.createElement('li');

      var $listIcon = document.createElement('span');
      $listIcon.className = 'anim-unlock icon-key';
      $key.appendChild($listIcon);

      var $keyText = document.createTextNode(' ' + key);
      $key.appendChild($keyText);

      $container.appendChild($key);
    });

    domCache.el.appendChild($container);
  };

  document.addEventListener('DOMContentLoaded', function() {
    fetch()
      .then(render)
      .catch(function(error) {
        console.error("Failed getting keys!", error);
      });
  });
})()
