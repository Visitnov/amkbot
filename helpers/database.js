var mysql = require('mysql');
/*
var pool  = mysql.createPool({
	connectionLimit : 500,
	host: 'localhost',// localhost on live // local 128.199.234.228
	// Live shan_tgp_user  1MGnBJ5c7fb30SOxc7fb305nBJSOx7d
	// user: 'shan_reddot_user',
	// password : 'nBJSOx7d5c7fb30c7fb3051MGnBJSOx',
	user:'root',
	password : 'root',
	port : 3306,
	database:'shan_promo_db',
	dateStrings: 'date',
	multipleStatements:true
});

var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {		
        callback(err, connection);
    });
};

exports.getConnection = getConnection;
*/
/*var logPool  = mysql.createPool({
	connectionLimit: 100,
	host: '128.199.205.83',
	port : 31306,
	database:'shan_admin',
	user: 'room_services',
	password : 'ASDfajw323941!xasDsfpcS2',
	multipleStatements:true,
	dateStrings: 'date',
	acquireTimeout: 1000000
});

var getConnection = function(callback) {
    logPool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

exports.getConnection = getConnection;
