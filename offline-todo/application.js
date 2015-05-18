(function() {
  'use strict';
  var db;

  databaseOpen().then(function() {
    alert("The database has been opened");
  });

  function databaseOpen() {
    return new Promise(function(resolve, reject) {
      var version = 2;
      var request = indexedDB.open('todos', version);

      // run migrations (if necessary)
      request.onupgradeneeded = function(e) {
        db = e.target.result;
        e.target.transaction.onerror = reject;

        switch(e.newVersion) {
          case 2:
            console.log('creating todoList');
            db.createObjectStore('todoList', { keyPath: '_id' });
            if(e.oldVersion === 1) { // remove old objectstore
              console.log('deleting todo');
              db.deleteObjectStore('todo');
            }
            break;

          default:
            console.log('creating todo');
            db.createObjectStore('todo', { keyPath: '_id' });
        }
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
