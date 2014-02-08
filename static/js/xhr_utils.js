/*jshint browser:true*/
/*global Promise*/
// Inspiration: http://www.html5rocks.com/en/tutorials/es6/promises/
(function(xhr) {
  'use strict';
  xhr.getJSON = function(url) {
    return xhr.get(url).then(JSON.parse);
  };

  xhr.postWithJSONResponse = function(url, data) {
    return xhr.post(url, data).then(JSON.parse);
  };

  xhr.put = function(url, data) {
    return xhr.request('PUT', url, data);
  };

  xhr.delete = function(url, data) {
    return xhr.request('DELETE', url, data);
  };

  xhr.get = function(url) {
    return xhr.request('GET', url);
  };

  xhr.post = function(url, data) {
    return xhr.request('POST', url, data);
  };

  xhr.request = function(method, url, data) {
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open(method, url);

      req.onload = function() {
        // This is called even on 404 etc so check the status
        if (req.status >= 200 && req.status < 300) {
          // Resolve the promise with the response text
          resolve(req.response);
        }
        else {
          // Otherwise reject with the status text
          // which will hopefully be a meaningful error
          reject(new Error(req.statusText));
        }
      };

      // Handle network errors
      req.onerror = function() {
        reject(new Error("Network Error"));
      };

      req.send(data);
    });
  };

})(window.xhr = window.xhr || {});
