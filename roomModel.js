var db = require('../helpers/database');
var userService = require('../models/userCoreServices');
var async = require('async');
var Memcached = require('memcached');
var memcached = new Memcached();
//var mysql_1 = global.mysql;
/*
exports.getRoomDetailByFliter = function(roomType,roomStatus,cb) {

	if( roomType == "" ){
		cb("invalidInput",{status: 500, description: "invalid parameters"});
		return;
	}
	if (roomStatus == "") {
		roomStatus = 'vacant';
	}
	//roomStatus = 'full' or 'empty'
	if (roomStatus == 'vacant') {
		var str = "SELECT banker AS b,room_id AS i,min_bet AS min,max_bet AS max,room_name AS n FROM `room` WHERE room_type=? AND player_count!=0 AND player_count!=8 ";	
	}else if (roomStatus == 'full') {
		var str = "SELECT banker AS b,room_id AS i,min_bet AS min,max_bet AS max,room_name AS n FROM `room` WHERE room_type=? AND player_count=8 ";
	}else if (roomStatus == 'empty') {
		var str = "SELECT banker AS b,room_id AS i,min_bet AS min,max_bet AS max,room_name AS n FROM `room` WHERE room_type=? AND player_count=0 ";
	}
	db.getConnection(function(err1, connection){
		if (err1) {
			//connection.release();
	  		console.log(' Error getting mysql_pool connection: ' + err1);
	  		cb(err1);
	  		//throw err;
	  	}else{
			connection.query(str,[roomType], function(err, result){
				connection.release();
				if(!err){
					if(result && result.length > 0){
						cb(null, {status:200,desc:'success',rooms:result});
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
*/
/*
exports.getPlayerCountByRoomType = function(roomType,cb) {
	if( roomType == "" ){
		cb("invalidInput",{status: 500, description: "invalid parameters"});
		return;
	}
	var str = "SELECT player_count AS c,room_id AS i,room_name AS n FROM `room` WHERE room_type=? ";
	db.getConnection(function(err1, connection){
		if (err1) {
			//connection.release();
	  		console.log(' Error getting mysql_pool connection: ' + err1);
	  		cb(err1);
	  		//throw err;
	  	}else{
			connection.query(str,[roomType], function(err, result){
				connection.release();
				if(!err){
					if(result && result.length > 0){
						cb(null, {status:200,desc:'success',rooms:result});
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
*/
exports.playNowByroomType = function(roomType,userCredit,cb) {
	if( roomType == "" || userCredit == ""){
		cb("invalidInput",{status: 500, description: "invalid parameters"});
		return;
	}
	var str = "SELECT room_id FROM `room` WHERE room_type=? AND player_count!=0 AND player_count!=8 AND ?>=banker ORDER BY banker ";
	db.getConnection(function(err1, connection){
		if (err1) {
			//connection.release();
	  		console.log(' Error getting mysql_pool connection: ' + err1);
	  		cb(err1);
	  		//throw err;
	  	}else{
			connection.query(str,[roomType,userCredit], function(err, result){
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
/*
exports.playNowByMinMaxBet = function(minBet,maxBet,cb) {
	if( minBet == "" || maxBet == ""){
		cb("invalidInput",{status: 500, description: "invalid parameters"});
		return;
	}
	var str = "SELECT room_id FROM `room` WHERE min_bet >=? AND max_bet <=? AND player_count!=0 AND player_count!=8 ORDER BY banker ";
	db.getConnection(function(err1, connection){
		if (err1) {
			//connection.release();
	  		console.log(' Error getting mysql_pool connection: ' + err1);
	  		cb(err1);
	  		//throw err;
	  	}else{
			connection.query(str,[minBet,maxBet], function(err, result){
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
*/
exports.getRoomDetail = function(cb) {
	memcached.connect( '127.0.0.1:11211', function( cerr, cconn ){
		if( cerr ) {
		   console.log( 'cconn.server'+cconn.server);
		   cb(cerr);
		}else{
			memcached.get('room', function (gcerr, gcdata) {
				if (gcerr) {
					console.log( 'gcerr'+gcerr);
					cb(gcerr);
				}else{
					if (gcdata == undefined) {
						console.log(gcdata);
						var str = "SELECT banker AS b,room_id AS i,min_bet AS min,max_bet AS max,room_name AS n FROM `room` WHERE room_status='strated' ";
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
											memcached.set('room', result, 60, function (scerr) { 
												if(scerr) {
													cb(scerr);
												}else{
													cb(null, {status:200,desc:'success from db',rooms:result});
												}
											});
										}else{
											cb(null, {status:500,desc:'fail'});
										}
									}else{
										cb(err);
									}
								});
							}
						});
					}else{
						cb(null, {status:200,desc:'success from cache',rooms:gcdata});
					}             
				}
			});
		}
	});
}
exports.getPlayerCountByRoomTypeAndStatus = function(roomType,roomStatus,cb) {
	if( roomType == "" ){
		cb("invalidInput",{status: 500, description: "invalid parameters"});
		return;
	}
	if (roomStatus == "") {
		roomStatus = 'vacant';
	}
	memcached.connect( '127.0.0.1:11211', function( cerr, cconn ){
		if( cerr ) {
		   console.log( 'cconn.server'+cconn.server);
		   cb(cerr);
		}else{
			memcached.get(roomType+roomStatus, function (gcerr, gcdata) {
				if (gcerr) {
					console.log( 'gcerr'+gcerr);
					cb(gcerr);
				}else{
					if (gcdata == undefined) {
						console.log(gcdata);
						if (roomStatus == 'vacant') {
							var str = "SELECT player_count AS c,room_id AS i,room_name AS n FROM `room` WHERE room_type=? AND player_count!=0 AND player_count!=8 AND is_listed=1 ";
						}else if (roomStatus == 'full') {
							var str = "SELECT player_count AS c,room_id AS i,room_name AS n FROM `room` WHERE room_type=? AND player_count=8 AND is_listed=1 ";
						}else if (roomStatus == 'empty') {
							var str = "SELECT player_count AS c,room_id AS i,room_name AS n FROM `room` WHERE room_type=? AND player_count=0 AND is_listed=1 ";
						}
						db.getConnection(function(err1, connection){
							if (err1) {
								//connection.release();
									console.log(' Error getting mysql_pool connection: ' + err1);
									cb(err1);
									//throw err;
								}else{
								connection.query(str,[roomType], function(err, result){
									connection.release();
									if(!err){
										if(result && result.length > 0){
											memcached.set(roomType+roomStatus, result, 60, function (scerr) { 
												if(scerr) {
													cb(scerr);
												}else{
													cb(null, {status:200,desc:'success from db',data:result});
												}
											});
											//cb(null, {status:200,desc:'success',data:result});
										}else{
											cb(null, {status:500,desc:'fail'});
										}
									}else{
										cb(err);
									}
								});
							}
						});
					}else{
						cb(null, {status:200,desc:'success from cache',data:gcdata});
					}             
				}
			});
		}
	});
	//roomStatus = 'full' or 'empty'
}
exports.getRoomPlayers = function(roomId,cb) {
	var str = "SELECT player_ids FROM `room` WHERE room_id=? ";	
	db.getConnection(function(err1, connection){
		if (err1) {
			//connection.release();
				console.log(' Error getting mysql_pool connection: ' + err1);
				cb(err1);
				//throw err;
			}else{
			connection.query(str,[roomId], function(err, result){
				connection.release();
				if(!err){
					if(result && result.length > 0){
						cb(null, {status:200,desc:'success',result});
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
