// Source: http://www.html5rocks.com/en/tutorials/es6/promises/
(function (xhr) {
  xhr.get = function (url) {
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open('GET', url);

      req.onload = function() {
        // This is called even on 404 etc so check the status
        if (req.status == 200) {
          // Resolve the promise with the response text
          resolve(req.response);
        }
        else {
          // Otherwise reject with the status text
          // which will hopefully be a meaningful error
          reject(Error(req.statusText));
        }
      };

      // Handle network errors
      req.onerror = function() {
        reject(Error("Network Error"));
      };

      req.send();
    });
  };

  xhr.getJSON = function (url) {
    return xhr.get(url).then(JSON.parse);
  };

})(window.xhr = window.xhr || {})
