(function() {
  'use strict';
  var db;

  databaseOpen().then(function() {
    alert("The database has been opened");
  });

  function databaseOpen() {
    return new Promise(function(resolve, reject) {
      var version = 1;
      var request = indexedDB.open('todos', version);

      // run migrations (if necessary)
      request.onupgradeneeded = function(e) {
        db = e.target.result;
        e.target.transaction.onerror = reject;
        db.createObjectStore('todo', { keyPath: '_id' });
      };

      // resolve
      request.onsuccess = function(e) {
        db = e.target.result;
        resolve();
      };

      // reject
      request.onerror = reject;
    });
  }
}());
