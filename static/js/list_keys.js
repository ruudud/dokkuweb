/*jshint browser:true*/
/*global xhr,onReady*/
(function () {
  'use strict';
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
        $el.classList.add('anim-bounceOutRight');
      })
      .catch(function(error) {
        console.error("Failed deleting key", error);
      });
  };

  var appendKey = function(key, $container) {
    key = key.trim().match(/((?:[\w]{2}:?){16})(?:\s(.+)?)?/);
    var fingerprint = key[1];
    var comment = key[2];

    var $key = document.createElement('li');
    $key.className = 'list-key-item';

    var $listIcon = document.createElement('span');
    $listIcon.className = 'icon-close';
    $key.appendChild($listIcon);

    var $textPad = document.createTextNode(' ');
    $key.appendChild($textPad);

    var $fingerprint = document.createElement('span');
    $fingerprint.className = 'key-fingerprint';
    $fingerprint.textContent = fingerprint;
    $key.appendChild($fingerprint);
    $key.appendChild($textPad.cloneNode());

    var $comment = document.createElement('span');
    $comment.className = 'key-comment';
    $comment.textContent = comment;
    $key.appendChild($comment);

    $key.addEventListener('click', onKeyClick);
    $container.appendChild($key);
  };

  var render = function(keys) {
    var $el = document.getElementById('keys');

    var $container = document.createElement('ul');
    $container.className = 'list-key';
    keys.forEach(function(fingerprint) {
      appendKey(fingerprint, $container);
    });

    $el.appendChild($container);
    domCache.keyList = $container;
  };


  onReady(function() {
    fetch()
      .then(render)
      .catch(function(error) {
        console.error("Failed getting keys", error);
      });
  });

  document.body.addEventListener('key:add', function(event) {
    appendKey(event.detail.fingerprint, domCache.keyList);
  });
})();
