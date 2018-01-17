var express = require('express');
var router = express.Router();
var request = require('request');
var human = 0;

//console.log("Inside home.js");
var roomModel = require('../models/roomModel');
var userService = require('../models/userCoreServices');
const PAGE_ACCESS_TOKEN = 'EAAb4mbE3UKQBAPs5Rw31mY7nGI5YeB3462SSEJZCBenC0zhCdJ6D6G0NNaUhaTBqPHl5p1X1won2ZA6geSkRAOhMynRBdJWcvVIw1HYAISa8oBF6q1tz8T8GmjgydDImZChDQwyht7oT2y3KmWtNqMLVOw1mmtF2ZA1M2A0Wqes0C6eil5tk';
router.all('/', function(req, res, next) { res.header("Access-Control-Allow-Origin", "*"); res.header("Access-Control-Allow-Headers", "X-Requested-With"); next(); });

router.get('/', function(req, res) {
  res.send('This is TestBot Server');
});
//webhook verification
router.get('/webhook', function(req, res) {
  if (req.query['hub.verify_token'] === 'shalala_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});
//persistant menu request
request({
    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: {access_token: PAGE_ACCESS_TOKEN},
    method: 'POST',
    json: {
      "setting_type" : "call_to_actions",
      "thread_state" : "existing_thread",
      "call_to_actions":[
        {
          "type":"postback",
          "title":"Chat With Human",
          "payload":"menu_chat_human"
        },
        {
          "type":"postback",
          "title":"Chat With Bot",
          "payload":"menu_chat_bot"
        },
        {
          "type":"web_url",
          "title":"Play Now",
          "url":"http://play.shankoemee.com"
        }
      ]
    }
}, function(error, response, body) {
        if (error) {
            console.log('Error request menu : ', error);
        } else if (response.body.error) {
            console.log('Error menu request : ', response.body.error);
        }
});
//Get started button request
request({
    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: {access_token: PAGE_ACCESS_TOKEN},
    method: 'POST',
    json: { 
      "setting_type":"call_to_actions",
      "thread_state":"new_thread",
      "call_to_actions":[
        {
          "payload":"0"
        }
      ]
    }
},function(error, response, body) {
        if (error) {
            console.log('Error gsButton : ', error);
        } else if (response.body.error) {
            console.log('Error gsButton request : ', response.body.error);
        }
});

//send test message function
function sendMessage(recipientId, message) {  
  console.log(recipientId);
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error here: ', response.body.error);
        }
    });
};

router.post('/webhook', function (req, res) {  
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if(event.message){
            if(human==0){
                if (event.message.text || event.message.quick_reply) { 
                if(event.message.quick_reply){
                    if(event.message.quick_reply.payload=="0"){
                    getButtonTemplate(event.sender.id);
                    } 
                    else if(event.message.quick_reply.payload=="NO"){
                    sendMessage(event.sender.id,{text:"Thanks :-)"});
                    } 
                    else if(event.message.quick_reply.payload=="ANDROID"){
                        var welcomeTextQ0 = {
                        "text":"​ေအာက္တြင္download linkရယူနုိင္ပါျပီ",  
                        "quick_replies":[
                      {
                        "content_type":"text",
                        "title":"ဆက္ရန္",
                        "payload":"YES"
                      },
                      {
                        "content_type":"text",
                        "title":"ေတာ္ျပီ",
                        "payload":"NO"
                      }
                      ]}
                        sendMessage(event.sender.id,welcomeTextQ0);
                    } 
                    else{
                        var welcomeTextQ1 = {
                        "text":"​ေအာက္တြင္download linkရယူနုိင္ပါျပီ",  
                        "quick_replies":[
                      {
                        "content_type":"text",
                        "title":"ဆက္ရန္",
                        "payload":"YES"
                      },
                      {
                        "content_type":"text",
                        "title":"ေတာ္ျပီ",
                        "payload":"NO"
                      }
                      ]}
                        sendMessage(event.sender.id,welcomeTextQ1);
                    } 
                }
                else if (!sendGreeting(event.sender.id, event.message.text)) {
                    sendMessage(event.sender.id,{text:"Shan game နဲ႕ ပတ္သက္တဲ့ ကိစၥကလြဲပီး တျခားစကား​ေတြ နားမလည္​ဘူးပါဗ်...​"});
                }
            }
        }   
        }
        else if(event.postback){
        
                if (event.postback.payload == "0") {
                var jsonName;
                request({
                  //https://graph.facebook.com/v2.6/<USER_ID>?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=PAGE_ACCESS_TOKEN
                  url: 'https://graph.facebook.com/v2.6/'+event.sender.id+'?fields=first_name,last_name',
                  qs: {
                        access_token: PAGE_ACCESS_TOKEN,
                        method: 'GET'
                      }
                }, function(error, response, body) {
                    if (error) {
                        console.log('Error request username : ', error);
                    } else if (response.body.error) {                      
                        console.log('Error username request : ', response.body);
                    }
                    jsonName = JSON.parse(response.body);
    
                    var welcomeTextGS = {
                      "text":"​မဂၤလာပါ "+jsonName["first_name"]+" "+jsonName["last_name"]+"က်ြန္​​ေတာ္​ ရွမ္းကိုးမီးကပါ လူႀကီးမင္း သိလိုေသာ အေႀကာင္းအရာေတြကို ဒီမွာ ေမးျမန္းနိုင္ပါတယ္...",
                      "quick_replies":[
                        {
                          "content_type":"text",
                          "title":"Okay",
                          "payload":"0"
                        }
                      ]}
                      sendMessage(event.sender.id, welcomeTextGS);

                });
          }

                else if(event.postback.payload=="Ok")
                {
                     //sendMessage(event.sender.id,{text:"Choose one"});
                    var welcomeTextQ2 = {
                    "text":"​Choose one",  
                    "quick_replies":[
                  {
                    "content_type":"text",
                    "title":"Android",
                    "payload":"ANDROID"
                  },
                  {
                    "content_type":"text",
                    "title":"IOS",
                    "payload":"IOS"
                  }
                  ]}
                    sendMessage(event.sender.id,welcomeTextQ2);
                }
                else if(event.postback.payload=="Well")
                {
                    sendMessage(event.sender.id,{text:"Thank you!!!"});
                }
                else if(event.postback.payload == "menu_chat_human"){
                    human = 1;
                    sendMessage(event.sender.id, {text: "Page ​admin ကို​ေျပာခ်င္​တဲ့စကားရွိရင္​ ဒီမွာခ်န္​ထားခဲ့ႏိုင္​ပါတယ္​။ Bot ကိုျပန္​​ေျပာခ်င္​ရင္​​ေတာ့ Menu မွာ Chat with Bot ကို​ႏွိပ္​ပါ။" });
                    //console.log("Postback received: " + JSON.stringify(event.postback));
                }
                else if (event.postback.payload == "menu_chat_bot") {
                    human = 0;
                    sendMessage(event.sender.id, {text:"​Hi လို႔ရိုက္​ၿပီး Bot နဲ႔စတင္​စကား​ေျပာနိုင္​ပါၿပီ"});
                }
                /*else{
                    var welcomeTextQ3 = {
                    "text":"​welcome to chatbot",  
                    "quick_replies":[
                  {
                    "content_type":"text",
                    "title":"YES",
                    "payload":"YES"
                  },
                  {
                    "content_type":"text",
                    "title":"NO",
                    "payload":"NO"
                  }
                  ]}
                    sendMessage(event.sender.id,welcomeTextQ3);
                }*/
        }    

    }
    res.sendStatus(200);
});



/*function kittenMessage(recipientId, text) {

    text = text || "";
    var values = text.split(' ');

    if (values.length === 3 && values[0] === 'kitten') {
        if (Number(values[1]) > 0 && Number(values[2]) > 0) {

            var imageUrl = "https://placekitten.com/" + Number(values[1]) + "/" + Number(values[2]);
            message = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Kitten",
                            "subtitle": "Cute kitten picture",
                            "image_url": imageUrl ,
                            "buttons": [{
                                "type": "web_url",
                                "url": imageUrl,
                                "title": "Show kitten"
                                }, {
                                "type": "postback",
                                "title": "I hate this",
                                "payload": "User " + recipientId + " likes kitten " + imageUrl,
                                }]
                            }]
                    }
                }
            };
        sendMessage(recipientId, message);
        return true;
        }
    }
    return false;
};*/
function sendGreeting(recipientId, text) {
    
        text = text.toUpperCase();
        if (text == "GET STARTED") {
            sendMessage(recipientId, {text: "Hi! I'm Mr.Shan. I am here to help you get tested for shan game related questions in Burmese language. If you are ready, just type 'Hello'" });
            return true;       
        }
        else if (text.length < 6 ) {
            var welcomeTextQ1 = {
                "text":"​မဂၤလာပါ။ က်ြန္​​ေတာ္​ ရွမ္းကိုးမီးကပါ လူႀကီးမင္း သိလိုေသာ အေႀကာင္းအရာေတြကို ဒီမွာ ေမးျမန္းနိုင္ပါတယ္...",
                "quick_replies":[
                  {
                    "content_type":"text",
                    "title":"YES",
                    "payload":"YES"
                  },
                  {
                    "content_type":"text",
                    "title":"NO",
                    "payload":"NO"
                  }
                ]}
            sendMessage(recipientId, welcomeTextQ1);       
            return true;
        }
        return false;         
}

function getButtonTemplate(recipientId){
    getDataFromDB(function(err, result) {
        if(err)
        {
            console.log(err);
        }
        else{
            console.log(result);

    var messageData={
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [{
            "title": "Game",
            "subtitle": "shankoemee",
            "image_url": "https://lh3.googleusercontent.com/-cVB_MbJEe-l2qBX1YOoE5NSIKpbpbOiBmZWbrpBra7N5Yp6KO5aNIZkIRFT6v5ElQ=w300",
        //"text":"What do you want to do next?",
        "buttons":[
        {
            "type": "postback",
            "title": result[0].request,
            "payload": result[0].id
        },
        {
            "type": "postback",
            "title": result[1].request,
            "payload": result[0].id
        },
        {
            "type": "postback",
            "title": result[2].request,
            "payload": result[0].id
        }
        ]}
        ]}
    }
  } 
  request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: messageData,
        }
    }, 
    function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });

    
}

        }

    });


   
function getDataFromDB(callback)
{
    var params = 0;
    roomModel.getfirstlevel(params, function(err, result) {
        if(err)
        {
            console.log(err);
            callback(err);
            //res.json({status:500,data:"Insert Fail", message:err});
        }
        else{
            //res.json({status:200,data:result});
            callback(null,result);
        }
    });
}
module.exports = router;