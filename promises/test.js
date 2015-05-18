require('es6-promise').polyfill();

function resolves_in_timeout() {
  'use strict';

  return new Promise(function(resolve, reject) {
    setTimeout(resolve, 1000);
  });
}

function rejects_in_timeout() {
  'use strict';

  return new Promise(function(resolve, reject) {
    setTimeout(reject, 500);
  });
}

resolves_in_timeout().then(function() {
  console.log('PASS: resolve called');
}, function() {
  console.log('FAIL: resolve not called');
});

rejects_in_timeout().then(function() {
  console.log('FAIL: reject not called');
}, function() {
  console.log('PASS: reject called');
});
