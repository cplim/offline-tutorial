(function() {
  'use strict';
  var db;

  databaseOpen().then(function() {
    alert("The database has been opened");
  });

  function databaseOpen() {
    return new Promise(function(resolve, reject) {
      var version = 4;
      var request = indexedDB.open('todos', version);

      // run migrations (if necessary)
      request.onupgradeneeded = function(e) {
        db = e.target.result;
        e.target.transaction.onerror = reject;

        switch(e.newVersion) {
          case 3:
            console.log('creating todoItem');
            db.createObjectStore('todoItem', { keyPath: '_id' });

            if(db.objectStoreNames.contains('todoList')) {
              console.log('deleting todoList');
              db.deleteObjectStore('todoList');
            }

            if(db.objectStoreNames.contains('todo')) {
              console.log('deleting todo');
              db.deleteObjectStore('todo');
            }
            break;

          case 2:
            console.log('creating todoList');
            db.createObjectStore('todoList', { keyPath: '_id' });

            if(db.objectStoreNames.contains('todo')) {
              console.log('deleting todo');
              db.deleteObjectStore('todo');
            }
            break;

          case 4:
            if(db.objectStoreNames.contains('todoList')) {
              console.log('deleting todoList');
              db.deleteObjectStore('todoList');
            }

            if(db.objectStoreNames.contains('todoItem')) {
              console.log('deleting todoItem');
              db.deleteObjectStore('todoItem');
            }
            // no break to create 'todo' objectStore
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
