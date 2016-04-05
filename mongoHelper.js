var EventEmitter = require('events');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;


var log = function() {
    console.log.apply(console, arguments);
};

log.color = function() {
    var args = [].slice.call(arguments);
    // args.unshift('\033[35m');
    // args.push('\033[39m');
    console.log.apply(console, args);
};


var mongoHelper = Object.create(EventEmitter.prototype);

mongoHelper.db = null;
mongoHelper.db_url = 'mongodb://' + (process.env.IP || 'localhost') + ':27017/webim';

mongoHelper.connect = function() {
    if(this.db) {
        return;
    }
    
    var self = this;
    MongoClient.connect(this.db_url, function(err, db) {
        if(err) {
            log(err);
            process.exit(1);
        }else {
            log.color('db connect success!');
            self.db = db;       

            self.emit('connected', db);
        }
    });

};

mongoHelper.drop = function(collection) {
    if(collection) {
        var falg = this.db.collection(collection).drop();
        if(falg) {
            this.emit('droped', collection);
        }else {
            log.color('collection can not be droped');
        }
    }else {

    }
};

mongoHelper.close = function() {
    if(this.db) {
        this.db.close();
        this.db = null;
    }
    this.emit('closed');
};

mongoHelper.connect();

module.exports = mongoHelper;