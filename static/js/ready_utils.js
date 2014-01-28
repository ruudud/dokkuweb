(function (window) {
  var isLoaded = false,
      fnq = [];

  var complete = function () {
    document.removeEventListener('DOMContentLoaded', complete, false);
    isLoaded = true;

    while (fnq.length > 0) {
      (fnq.shift())();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', complete, false);
  } else {
    window.setTimeout(complete, 0);
  }

  window.onReady = function (fn) {
    if (isLoaded) {
      window.setTimeout(fn, 0);
    } else {
      fnq.push(fn);
    }
  };
})(window);
