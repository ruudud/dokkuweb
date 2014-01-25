(function() {
    
  var save = function (data) {
    return xhr.postWithJSONResponse('/cgi-bin/keys', data);
  }
  
  var onSubmitKey = function($form) {
    var postData = 'pubkey=' + $form.pubkey.value;
    var hostId = postData.split(/\s/)[2];
    
    var triggerEvent = function (data) {
      var event = new CustomEvent('key:add', {
        detail: { fingerprint: data.fingerprint + ' ' + hostId }
      });
      document.body.dispatchEvent(event);
    };
    
    save(postData)
      .then(triggerEvent)
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