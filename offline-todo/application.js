(function() {
  'use strict';
  var db, input;

  databaseOpen().then(function() {
    input = document.querySelector('input');
    document.body.addEventListener('submit', onSubmit);
  });

  function onSubmit(e) {
    e.preventDefault();
    var todo = {
      text: input.value,
      _id: String(Date.now())
    };
    databaseTodosPut(todo).then(function() {
      input.value = '';
    });
  }

  function databaseTodosPut(todo) {
    return new Promise(function(resolve, reject) {
      var transaction = db.transaction(['todo'], 'readwrite');
      var store = transaction.objectStore('todo');
      var request = store.put(todo);
      transaction.oncomplete = resolve;
      request.onerror = reject;
    });
  }

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
