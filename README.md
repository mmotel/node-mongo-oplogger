# node-mongo-oplogger

Node.js &amp; MongoDB: Oplog tailing


### Idea

```js
  var Oplogger = require('node-mongo-oplogger');

  var Oplog = Oplogger.tail( MONGO_URL, MONGO_OPLOG_URL, { 'db': 'dbName', 'colls': [ 'collName', ... ] } );

  Oplog.onInsert( function ( item ) {
    // item {
    //   db: dbName,
    //   coll: collName,
    //   _id: MongoObjectId,
    //   doc: {  } // inserted document
    // }
  } );

  Oplog.onUpdate( function ( item ) {
    // item {
    //   db: dbName,
    //   coll: collName,
    //   _id: MongoObjectId,
    //   fields: {  } // modified fields
    // }
  } );

  Oplog.onRemove( function ( item ) {
    // item {
    //   db: dbName,
    //   coll: collName,
    //   _id: MongoObjectId
    // }
  } );
```
