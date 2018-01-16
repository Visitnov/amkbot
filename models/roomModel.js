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
 
function retrieveReplySql(req,callback){
    var query = "SELECT * FROM bot WHERE request='"+req+"';";   
    getConnection(function (err, connection) {
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

exports.retrieveReply = retrieveReply;
exports.buttonMsg = buttonMsg;
exports.sendMessage = sendMessage;