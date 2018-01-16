
/*
// version: 20170512
var ServiceId = 'drd';
var Secret = 'pCRKKcmEbmrOIgeZxbemj70thlfEOcTGM6h5JDS4Vq7lZKzzQh08P0izVdQmpXCA';
var APIDomain = 'http://play.shankoemee.com/coreservices'; //'http://localhost:8088/coreservices'; //
var APIDomainforGiftToken = 'http://128.199.234.228:5152/apis';
var Request = require('request');

exports.getUserFromToken = function (uid, token, reply) {

	if (typeof reply !== 'function') reply = function (err, ret) {};

	var api_url = APIDomain + "/getUserFromToken";

	var requestURL = api_url + "?uid=" + uid + "&token=" + token + "&sid=" + ServiceId + "&secret=" + Secret;

	Request(requestURL, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
				var jDecoded = JSON.parse(body);
				//console.log(jDecoded.status);
				if (jDecoded.status != 1) {
					reply(jDecoded);

				} else {
					reply(null, jDecoded);
				}
			} catch (err) {
				console.log("getUserFromToken request:");
				console.log(body);
				reply({
					status: 500,
					description: "unknown error"
				});
			}
		} else {
			reply({
				status: 500,
				description: "request error"
			});
		}
	});
};

exports.giveCredit = function (uid, token, amount, desc, reply) {

	if (typeof reply !== 'function') reply = function (err, ret) {};

	var api_url = APIDomain + "/giveCredit";

	var requestURL = api_url + "?uid=" + uid + "&token=" + token + "&sid=" + ServiceId + "&secret=" + Secret;

	requestURL += "&amount=" + amount + "&desc=" + desc;

	Request(requestURL, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
				var jDecoded = JSON.parse(body);
				reply(null, jDecoded);
			} catch (err) {
				console.log("getUserFromToken request:");
				console.log(body);
				reply({
					status: 500,
					description: "unknown error"
				});
			}
		} else {
			reply({
				status: 500,
				description: "request error"
			});
		}
	});
};

exports.giveDiamond = function (uid, token, amount, desc, reply) {

	if (typeof reply !== 'function') reply = function (err, ret) {};

	var api_url = APIDomain + "/giveDiamond";

	var requestURL = api_url + "?uid=" + uid + "&token=" + token + "&sid=" + ServiceId + "&secret=" + Secret;

	requestURL += "&amount=" + amount + "&desc=" + desc;

	Request(requestURL, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
				var jDecoded = JSON.parse(body);
				reply(null, jDecoded);
			} catch (err) {
				console.log("getUserFromToken request:");
				console.log(body);
				reply({
					status: 500,
					description: "unknown error"
				});
			}
		} else {
			reply({
				status: 500,
				description: "request error"
			});
		}
	});
};

exports.purchaseBefore = function (uid, token, start, end, reply) {

	if (typeof reply !== 'function') reply = function (err, ret) {};

	var api_url = APIDomain + "/checkUserPurchaseBefore";

	var requestURL = api_url + "?uid=" + uid + "&token=" + token + "&sid=" + ServiceId + "&secret=" + Secret;

	requestURL += "&start=" + start + "&end=" + end;

	Request(requestURL, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
				var jDecoded = JSON.parse(body);
				reply(null, jDecoded);
			} catch (err) {
				console.log("purchaseBefore request:");
				console.log(body);
				console.log(err);
				reply({
					status: 500,
					description: "unknown error"
				});
			}
		} else {
			reply({
				status: 500,
				description: "request error"
			});
		}
	});
};
exports.purchaseProductBefore = function (uid, pid, token, start, end, reply) {

	if (typeof reply !== 'function') reply = function (err, ret) {};

	var api_url = APIDomain + "/checkUserPurchaseBefore";

	var requestURL = api_url + "?uid=" + uid + "&token=" + token + "&sid=" + ServiceId + "&secret=" + Secret;

	requestURL += "&start=" + start + "&end=" + end + "&pid=" + pid;

	Request(requestURL, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
				var jDecoded = JSON.parse(body);
				reply(null, jDecoded);
			} catch (err) {
				console.log("purchaseProductBefore request:");
				console.log(body);
				console.log(err);
				reply({
					status: 500,
					description: "unknown error"
				});
			}
		} else {
			reply({
				status: 500,
				description: "request error"
			});
		}
	});
};

exports.topupProviderBefore = function (uid, pid, token, start, end, reply) {

	if (typeof reply !== 'function') reply = function (err, ret) {};

	var api_url = APIDomain + "/checkUserPurchaseBefore";

	var requestURL = api_url + "?uid=" + uid + "&token=" + token + "&sid=" + ServiceId + "&secret=" + Secret;

	requestURL += "&start=" + start + "&end=" + end + "&cid=" + pid;

	Request(requestURL, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
				var jDecoded = JSON.parse(body);
				reply(null, jDecoded);
			} catch (err) {
				console.log("topupProviderBefore request:");
				console.log(body);
				console.log(err);
				reply({
					status: 500,
					description: "unknown error"
				});
			}
		} else {
			reply({
				status: 500,
				description: "request error"
			});
		}
	});
};

exports.getPurchaseTotal = function (uid, token, start, end, reply) {

	if (typeof reply !== 'function') reply = function (err, ret) {};

	var api_url = APIDomain + "/checkUserPurchaseBefore";

	var requestURL = api_url + "?uid=" + uid + "&token=" + token + "&sid=" + ServiceId + "&secret=" + Secret;

	requestURL += "&start=" + start + "&end=" + end + "&pid=all";

	Request(requestURL, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
				var jDecoded = JSON.parse(body);
				reply(null, jDecoded);
			} catch (err) {
				console.log("getPurchaseTotal request:");
				console.log(body);
				console.log(err);
				reply({
					status: 500,
					description: "unknown error"
				});
			}
		} else {
			reply({
				status: 500,
				description: "request error"
			});
		}
	});
};

exports.getUserByID = function (uid, reply) {

	if (typeof reply !== 'function') reply = function (err, ret) {};

	var api_url = APIDomain + "/getUserByID";

	var requestURL = api_url + "?uid=" + uid + "&sid=" + ServiceId + "&secret=" + Secret;

	Request(requestURL, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
				var jDecoded = JSON.parse(body);
				//console.log(jDecoded.status);
				if (jDecoded.status != 1) {
					reply(jDecoded);

				} else {
					reply(null, jDecoded);
				}
			} catch (err) {
				console.log(err);
				console.log("getUserByID request:");
				console.log(body);
				reply({
					status: 500,
					description: "unknown error"
				});
			}
		} else {
			reply({
				status: 500,
				description: "request error"
			});
		}
	});
};

exports.transferCredit = function (uid, token, amount, receiverId, reply) {

	if (typeof reply !== 'function') reply = function (err, ret) {};

	var api_url = APIDomain + "/transferCredit";

	var requestURL = api_url + "?uid=" + uid + "&token=" + token + "&sid=" + ServiceId + "&secret=" + Secret;

	requestURL += "&amount=" + amount + "&rid=" + receiverId;

	Request(requestURL, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
				var jDecoded = JSON.parse(body);
				reply(null, jDecoded);
			} catch (err) {
				console.log("transferCredit request:");
				console.log(body);
				reply({
					status: 500,
					description: "unknown error"
				});
			}
		} else {
			reply({
				status: 500,
				description: "request error"
			});
		}
	});
};
exports.giveGiftToken = function (uid, token, amount, desc, reply) {

	if (typeof reply !== 'function') reply = function (err, ret) {};

	var api_url = APIDomainforGiftToken + "/giveGiftToken";

	var requestURL = api_url + "?uid=" + uid + "&token=" + token + "&sid=" + ServiceId + "&secret=" + Secret;

	requestURL += "&amount=" + amount + "&desc=" + desc;
	//console.log(requestURL);
	Request(requestURL, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
				var jDecoded = JSON.parse(body);
				reply(null, jDecoded);
			} catch (err) {
				console.log("getUserFromToken request:");
				console.log(body);
				reply({
					status: 500,
					description: "unknown error"
				});
			}
		} else {
			reply({
				status: 500,
				description: "request error"
			});
		}
	});
};
exports.heartUseCount = function (uid,start, end, reply) {

	if (typeof reply !== 'function') reply = function (err, ret) {};

	var api_url = APIDomainforGiftToken + "/heartUseCount";

	var requestURL = api_url + "?uid=" + uid + "&sid=" + ServiceId + "&secret=" + Secret;

	requestURL += "&start=" + start + "&end=" + end;
	//console.log(requestURL);
	Request(requestURL, function (error, response, body) {
		//console.log(response);
		if (!error && response.statusCode == 200) {
			try {
				var jDecoded = JSON.parse(body);
				reply(null, jDecoded);
			} catch (err) {
				console.log("getUserFromToken request:");
				console.log(body);
				reply({
					status: 500,
					description: "unknown error"
				});
			}
		} else {
			console.log("here heartUseCount");
			reply({
				status: 500,
				description: "request error"
			});
		}
	});
};