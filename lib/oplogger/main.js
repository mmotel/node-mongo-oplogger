module.exports = (function () {

  var Tail = function (MONGO_URL, MONGO_OPLOG_URL, target) {

    //callbacks for target actions
    var Callbacks = {
      'onInsert': [],
      'onUpdate': [],
      'onRemove': []
    };

    //helper for calling Callbacks
    var Call = function (callbacks, args) {
      for(var i=0; i < callbacks.length; i++) {
        callbacks[i](args);
      }
    };

    //helper: array.contains(object)
    var Contains = function (array, object) {
      for (var i=0; i < array.length; i++){
        if(array[i] === object) {
          return true;
        }
        return false;
      }
    };

    //Insert handler
    var InsertHandler = function (db, coll, oplogdoc) {
      var item = {
        'db': db,
        'coll': coll,
        '_id': oplogdoc.o._id,
        'doc': oplogdoc.o
      };
      Call(Callbacks.onInsert, item);
    };
    //Update handler
    var UpdateHandler = function (db, coll, oplogdoc) {
      var item = {
        'db': db,
        'coll': coll,
        '_id': oplogdoc.o2._id,
        'modifier': oplogdoc.o
      };
      Call(Callbacks.onUpdate, item);
    };

    //Remove handler
    var RemoveHandler = function (db, coll, oplogdoc) {
      var item = {
        'db': db,
        'coll': coll,
        '_id': oplogdoc.o._id
      };
      Call(Callbacks.onRemove, item);
    };

    //function called by oplogger
    var OplogCallback = function (oplogdoc) {
      console.log(oplogdoc);
      console.log(oplogdoc.o);

      //check if oplogdoc.ns is in target
      var ns = oplogdoc.ns.split('.');
      console.log(ns);
      var db = ns[0];
      var coll = ns[1];
      if(db === target.db && Contains(target.colls, coll)) {
        //check operation type
        var operation = oplogdoc.op;
        if (operation === 'i') {
          //insert
          InsertHandler(db, coll, oplogdoc);
        }
        else if (operation === 'u') {
          //update
          UpdateHandler(db, coll, oplogdoc);
        }
        else if (operation === 'd') {
          //remove
          RemoveHandler(db, coll, oplogdoc);
        }
      }
    };

    //start tailing oplog
    var oplog = require('./oplog.js');
    oplog(MONGO_OPLOG_URL, OplogCallback);

    //methods to register callbacks
    return {
      'onInsert': function (callback) {
        Callbacks.onInsert.push(callback);
      },
      'onUpdate': function (callback) {
        Callbacks.onUpdate.push(callback);
      },
      'onRemove': function (callback) {
        Callbacks.onRemove.push(callback);
      }
    };

  };

  return {
    'tail': Tail
  };
} )();
