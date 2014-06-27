module.exports = function ( MONGO_OPLOG_URL, callback ) {

  var mongo = require('mongodb');

  // Open the connection to the database
  mongo.MongoClient.connect( MONGO_OPLOG_URL, function( err, db ) {
    if( err ){ console.log( err ); return; }
    console.log("oplog: open db");
      // Get to oplog collection
      db.collection( "oplog.rs", function( err, oplog ) {
        if( err ){ console.log( err ); return; }
        console.log("oplog: open oplog.rs");
          // Find the highest timestamp
          oplog.find( {}, { ts: 1 } ).sort( { $natural: -1 } ).limit( 1 ).
           toArray( function( err, data ) {

            if( err ){ console.log( err ); return; }
              lastOplogTime = data[0].ts;
              // If there isn't one found, get one from the local clock
              var queryForTime;
              if( lastOplogTime ) {
                queryForTime = { $gt: lastOplogTime };
              } else {
                var timestamp = new mongo.Timestamp( 0, Math.floor( new Date().getTime() / 1000 ) );
                queryForTime = { $gt: timestamp };
              }
              // Create a cursor for tailing and set it to await data
              cursor = oplog.find( { ts: queryForTime },
                { tailable: true, awaitdata: true, oplogReplay: true, numberOfRetries: -1 });
              // Wrap that cursor in a Node Stream
              stream = cursor.stream();
              console.log("oplog: stream ready");
              // And when data arrives at that stream, print it out
              stream.on( 'data', callback );
          });
      });
  });

};
