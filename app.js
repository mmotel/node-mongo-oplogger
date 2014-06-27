
var Oplogger = require('./lib/oplogger/main.js');

var MONGO_URL = 'mongodb://localhost:27017/testdb';
var MONGO_OPLOG_URL = 'mongodb://oplogger:superhaslo123@localhost:27017/local?authSource=admin';

var Oplog = Oplogger.tail( MONGO_URL, MONGO_OPLOG_URL,
              { 'db': 'testdb', 'colls': [ 'category' ] } );
