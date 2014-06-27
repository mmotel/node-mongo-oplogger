module.exports = ( function () {

  var Tail = function ( MONGO_URL, MONGO_OPLOG_URL, target ) {

    var Callbacks = {
      'onInsert': [],
      'onUpdate': [],
      'onRemove': []
    };

    var oplog = require('./oplog.js');
    oplog( MONGO_OPLOG_URL, function ( oplogdoc ) {
      console.log( oplogdoc );
    } );

    return {
      'onInsert': function ( callback ) {
        Callbacks.onInsert.push( callback );
      },
      'onUpdate': function ( callback ) {
        Callbacks.onUpdate.push( callback );
      },
      'onRemove': function ( callback ) {
        Callbacks.onRemove.push( callback );
      }
    };

  };

  return {
    'tail': Tail
  };
} )();
