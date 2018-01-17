
var db = require('../helpers/database');


function getfirstlevel(id,callback){
    const query = "SELECT * FROM bot WHERE request LIKE '__0%'";
    db.getConnection(function (err, connection) {
        if(err){
            callback(err);
        }else{
            connection.query(query, function (err, result) {
                connection.release();
                if (err) {
                    callback(err);
                } else {
                    callback(null,result);
                }
            });
        }
    });
}

function retrieveReplySql(req,callback){
    const query = req === "Entry" ? "SELECT request FROM bot GROUP BY request" : "SELECT reply FROM bot WHERE request='" + req + "';";
    db.getConnection(function (err, connection) {
        if(err){
            callback(err);
        }else{
            connection.query(query, function (err, result) {
                connection.release();
                if (err) {
                    callback(err);
                } else {
                    callback(null,result);
                }
            });
        }
    });
}



function retrieveReply(req, callback) {
    const client = new Client({
        connectionString: connectionString,
        ssl: true,
    });
    client.connect();
    const query = req === "Entry" ? "SELECT request FROM \"AMK\" GROUP BY request" : "SELECT reply FROM \"AMK\" WHERE request='" + req + "';";
    client.query(query).then(res => {
        callback(res.rows.map(function (rec) { return !rec.reply ? rec.request : rec.reply }));
    }).catch(e => {
        client.end();
        console.error('query error', e.message, e.stack)
    })

}


function sendMessage(recipientId, message) {
    // request({
    //     url: 'https://graph.facebook.com/v2.6/me/messages',
    //     qs: { access_token: process.env.Facebook_Credential },
    //     method: 'POST',
    //     json: {
    //         recipient: { id: recipientId },
    //         message: message,
    //     }
    // }, function (error, response, body) {
    //     if (error) {
    //         console.log('Error sending message: ', error);
    //     } else if (response.body.error) {
    //         console.log('Error: ', response.body.error);
    //     }
    // });
    console.log(message.attachment.payload.elements[0].buttons);
};

  function buttonMsg(recipientId, text) {

    retrieveReply(text, function (resFromDb) {
        if (resFromDb.length === 0) {

            buttonMsg(recipientId, "Entry");
            return;
        }
        var buttonToReply = resFromDb.map(function (element) {
            return {
                "type": "postback",
                "title": element,
                "payload": element
            }
        });
        message = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Plz tap!",
                        "buttons": buttonToReply
                    }]
                }
            }
        };
        sendMessage(recipientId, message);
    });
};




retrieveReplySql('Download Link လုိခ်င္လုိ႔',function(err,res){ console.log(res)});
//retrieveReplySql('Android ',function(err,res){ console.log(res)});
//retrieveReplySql('IOS',function(err,res){ console.log(res)});
//retrieveReplySql('PC/Web ',function(err,res){ console.log(res)});





exports.retrieveReply = retrieveReply;
exports.buttonMsg = buttonMsg;
exports.sendMessage = sendMessage;
exports.retrieveReplySql = retrieveReplySql;
//exports.getConnection = getConnection;
exports.getfirstlevel = getfirstlevel;