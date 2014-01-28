(function () {

  var domCache = {};

  var fetch = function() {
    return xhr.getJSON('/cgi-bin/keys');
  };
  var deleteKey = function(fingerprint) {
    return xhr.delete('/cgi-bin/keys?fingerprint=' + encodeURIComponent(fingerprint));
  };

  var onKeyClick = function(event) {
    var $el = event.currentTarget;
    var removeElement = function () {
      $el.removeEventListener('animationend', removeElement, false);
      $el.removeEventListener('webkitAnimationEnd', removeElement, false);
      $el.remove();
    };
    $el.addEventListener('animationend', removeElement, false);
    $el.addEventListener('webkitAnimationEnd', removeElement, false);

    var fingerprint = $el.textContent.trim().split(/\s/)[0];

    deleteKey(fingerprint)
      .then(function () {
        $el.classList.add('bounceOutRight');
      })
      .catch(function(error) {
        console.error("Failed deleting key", error);
      });
  };

  var appendKey = function(fingerprint, $container) {
    var $key = document.createElement('li');
    $key.className = 'list-key-item';

    var $listIcon = document.createElement('span');
    $listIcon.className = 'anim-unlock icon-key';
    $key.appendChild($listIcon);

    var $keyText = document.createTextNode(' ' + fingerprint);
    $key.appendChild($keyText);

    $key.addEventListener('click', onKeyClick);
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
