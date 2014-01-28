(function() {

  var save = function (data) {
    return xhr.postWithJSONResponse('/cgi-bin/keys', data);
  }

  var onSubmitKey = function($form) {
    var input = $form.pubkey.value.trim(),
        $error = document.getElementById('js-addkey-error');

    // Format of key: algorithm (e.g. ssh-rsa), base64 encoded pubkey and an optional comment
    var keyObj = input.match(/^(.+)\s((?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)(?:\s(.+))?$/);
    if (!keyObj) {
      $error.textContent = 'Wrong format in submitted key. Example: "ssh-rsa AAAA...== user@host"';
      return;
    }

    var comment = keyObj[3] || '';
    var postData = 'pubkey=' + input;

    var triggerEvent = function (data) {
      var event = new CustomEvent('key:add', {
        detail: { fingerprint: data.fingerprint + ' ' + comment }
      });
      document.body.dispatchEvent(event);
    };

    var clearForm = function () {
      $error.textContent = '';
      $form.pubkey.value = '';
    };

    save(postData)
      .then(triggerEvent)
      .then(clearForm)
      .catch(function(error) {
        console.error("Error when saving new key", error);
      });
  };

  var bindSubmit = function(id, fn) {
    var $el = document.getElementById(id);
    addEventListener('submit', function(event) {
      event.preventDefault();
      fn.call(null, $el, event);
    });
  };

  document.addEventListener('DOMContentLoaded', function() {
    bindSubmit('js-addkey', onSubmitKey);
  });
})()
