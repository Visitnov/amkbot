
// const { Client } = require('pg');


// const connectionString = !process.env.NODE_ENV ? "postgres://lynnphayu:@host:5432/lynnphayu" : process.env.DATABASE_URL;
// const connectionString = "postgres://mwhtahtviakiyg:5bc6c570e87bdd4e35e1921e2313dffee57fff200f16905bd8705042eee397b6@ec2-107-21-95-70.compute-1.amazonaws.com:5432/df9m1g8lnp49v9";

var request = require('request');
var mysql      = require('mysql');
var pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'chatbot',
  multipleStatements: true
});

var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

exports.getConnection = getConnection;
 
