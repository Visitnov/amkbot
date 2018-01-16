/*var db = require('../helpers/database');
var memoryCache = require('../helpers/memoryCache');
var userService = require('../models/userCoreServices');
//var async = require('async');

exports.playNowByroomType = function(roomType,userCredit,cb) {
	if( roomType == "" || userCredit == ""){
		cb("invalidInput",{status: 500, description: "invalid parameters"});
		return;
	}
	var str = "SELECT * FROM (SELECT room_id FROM `room` WHERE room_type=? AND player_count!=0 AND player_count!=8 AND banker <=?  AND is_listed = 1 AND (room_status = 'strated' OR room_status = 'started') ORDER BY banker LIMIT 1) notfull UNION SELECT * FROM (SELECT room_id FROM `room` WHERE room_type=? AND player_count=0 AND banker <=?  AND is_listed = 1 AND (room_status = 'strated' OR room_status = 'started')  ORDER BY banker LIMIT 1) empty ";
	db.getConnection(function(err1, connection){
		if (err1) {
			//connection.release();
	  		console.log(' Error getting mysql_pool connection: ' + err1);
	  		cb(err1);
	  		//throw err;
	  	}else{
			connection.query(str,[roomType,userCredit,roomType,userCredit], function(err, result){
				connection.release();
				if(!err){
					if(result && result.length > 0){
						cb(null, {status:200,desc:'success',room_id:result[0].room_id});
					}else{
						cb(null, {status:500,desc:'fail'});
					}
				}else{
					cb(err);
				}
			});
		}
	});
}

exports.getRoomDetail = function(cb) {

	// try to load from cache
	var roomDetail = memoryCache.getFromCache("getRoomDetail");
	if(roomDetail !== null){
		cb(null, {status:200,desc:'success from cache', rooms: roomDetail});
		return;
	}

	var str = "SELECT banker AS b,room_id AS i,min_bet AS min,max_bet AS max,room_name AS n,is_locked AS l FROM `room` WHERE is_listed=1 ";
	db.getConnection(function(err1, connection){
		if (err1) {
			//connection.release();
			  console.log(' Error getting mysql_pool connection: ' + err1);
			  cb(err1);
			  //throw err;
		}else{
			connection.query(str, function(err, result){
				connection.release();
				if(!err){
					if(result && result.length > 0){
						memoryCache.setCache("getRoomDetail", result, 60);
						cb(null, {status:200,desc:'success from db', rooms:result});
					}else{
						cb(null, {status:500,desc:'fail'});
					}
				}else{
					cb(err);
				}
			});
		}
	});
}

exports.getPlayerCountByRoomType = function(roomType,cb) {
	if( roomType == "" ){
		cb("invalidInput",{status: 500, description: "invalid parameters"});
		return;
	}

	var cacheKey = "getPlayerCountByRoomType:" + roomType;

	var playerCount = memoryCache.getFromCache(cacheKey);
	if(playerCount !== null){
		cb(null, {status:200,desc:'success from cache', data: playerCount});
		return;
	}

	var str = "SELECT player_count AS c,room_id AS i,room_name AS n FROM `room` WHERE room_type=? AND (room_status = 'strated' OR room_status = 'started');";
	
	db.getConnection(function(err1, connection){
		if (err1) {
			console.log(' Error getting mysql_pool connection: ' + err1);
			cb(err1);
		}else{
			connection.query(str,[roomType], function(err, result){
				connection.release();
				if(!err){
					if(result && result.length > 0){
						memoryCache.setCache(cacheKey, result, 10);
						cb(null, {status:200,desc:'success from db', data:result});
					}else{
						cb(null, {status:500,desc:'fail'});
					}
				}else{
					cb(err);
				}
			});
		}
	});
}

exports.getRoomPlayers = function(roomId, cb) {

	var cacheKey = "getRoomPlayers:" + roomId;
	
	var roomPlayers = memoryCache.getFromCache(cacheKey);
	if(roomPlayers !== null){
		cb(null, {status:200,desc:'success from cache', data: roomPlayers});
		return;
	}

	var str = "SELECT player_ids AS g FROM `room` WHERE room_id=? ";	
	db.getConnection(function(err1, connection){
		if (err1) {
				console.log(' Error getting mysql_pool connection: ' + err1);
				cb(err1);
			}else{
			connection.query(str,[roomId], function(err, result){
				connection.release();
				if(!err){
					if(result && result.length > 0){
						var val = result[0].g;
						memoryCache.setCache(cacheKey, val, 10);
						cb(null, {status:200,desc:'success', data: val});
					}else{
						cb(null, {status:404,desc:'room not found'});
					}
				}else{
					cb(err);
				}
			});
		}
	});
}

