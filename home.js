var express = require('express');  
var bodyParser = require('body-parser');  
var request = require('request');  
var roomModel = require('./models/roomModel');
var app = express();
var human=0;
app.use(bodyParser.urlencoded({extended: false}));  
app.use(bodyParser.json());  
app.listen((process.env.PORT || 3000));


request({
    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
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
          "title":"View facebook page",
          "url":"https://www.facebook.com/ShanKoeMee"
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

/*request({
    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: 'POST',
    json: { 
      "setting_type":"call_to_actions",
      "thread_state":"new_thread",
      "call_to_actions":[
        {
          "payload":"gsButton"
        }
      ]
    }
},function(error, response, body) {
        if (error) {
            console.log('Error gsButton : ', error);
        } else if (response.body.error) {
            console.log('Error gsButton request : ', response.body.error);
        }
        //console.log('Error gsButton out : ', response.body);
        //console.log('Error gs request : ', response);
});*/


//Server frontpage
app.get('/', function (req, res) {  
    res.send('This is TestBot Server');
});

//Facebook Webhook
app.get('/webhook', function (req, res) {  
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

app.get('/getReply',function(req,res){
    console.log(req.query);
    roomModel.retrieveReplySql(req.query.request,function(err,resp){ res.send(resp)});
});

app.post('/webhook', function (req, res) {  
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if(event.message){
            if(human==0){
                if (event.message.text || event.message.quick_reply) { 
                if(event.message.quick_reply){
                    if(event.message.quick_reply.payload=="YES"){
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
                else if (!kittenMessage(event.sender.id, event.message.text)) {
                    if(event.message.text=="Hi" || event.message.text=="hi"){
                    sendMessage(event.sender.id, {text:"မဂၤလာပါ။ က်ြန္​​ေတာ္​ ရွမ္းကိုးမီးကပါ လူႀကီးမင္း သိလိုေသာ အေႀကာင္းအရာေတြကို ဒီမွာ ေမးျမန္းနိုင္ပါတယ္..."});
                    }
                    else{
                    sendMessage(event.sender.id,{text:"Shan game နဲ႕ ပတ္သက္တဲ့ ကိစၥကလြဲပီး တျခားစကား​ေတြ နားမလည္​ဘူးပါဗ်...​"});
                    }
                }
            }
        }   
        }
        else if(event.postback){
                /*switch(event.postback.payload){
                    case 'OK':
                        sendMessage(event.sender.id,'I got it');
                        
                        break;

                    case 'Well':
                        sendMessage(event.sender.id,'Congratulations');
                        
                        break;  

                    default:
                        sendMessage(event.sender.id,'default');
                        
                }*/
                if(event.postback.payload=="Ok")
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
                else{
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
                }
        }    

    }
    res.sendStatus(200);
});

function sendMessage(recipientId, message) {  
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, 
    function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

/*function sendGreeting(recipientId, text) {
    
        /*text = test.toUpperCase();
        if (text === "GET TESTED") {
            sendMessage(event.sender.id, {text: "Hi! I'm Mr.Shan. I am here to help you get tested for shan game related questions in Burmese language. If you are ready, just type 'Hello'" });
            return true;       
        }
        if (text.length < 6 ) {
            var welcomeTextQ1 = {
                "text":"​မဂၤလာပါ။ က်ြန္​​ေတာ္​ ရွမ္းကိုးမီးကပါ လူႀကီးမင္း သိလိုေသာ အေႀကာင္းအရာေတြကို ဒီမွာ ေမးျမန္းနိုင္ပါတယ္..."; 
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
            sendMessage(event.sender.id, welcomeTextQ1);       
            return true;
        }
        return false;         
}*/

function kittenMessage(recipientId, text) {

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
};

/*function sendFirstMenu(recipientId){
    var messageData={
        "recipient":{
            "id":"recipientId"
        },
        "message":{
        "attachment":{
        "type":"template",
        "payload":{
        "template_type":"button",
        "text":"What do you want to do next?",
        "buttons":[
          {
            "type":"web_url",
            "url":"https://www.messenger.com",
            "title":"Visit Messenger"
          },
            {
                "type": "postback",
                "title": "Get Order",
                "payload": "User " + recipientId + " likes kitten " + imageUrl,
            },
            {
                "type": "postback",
                "title": "I like this",
                "payload": "User " + recipientId + " likes kitten " + imageUrl,
            },
        ]
      }
    }
  }
};
callsendAPI(messageData);
}*/

function getButtonTemplate(recipientId){
    
    var messageData={
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": [{
            "title": "Dog",
            "subtitle": "Cute Dog picture",
            "image_url": "https://www.google.com.mm/imgres?imgurl=http%3A%2F%2F",
        //"text":"What do you want to do next?",
        "buttons":[
        {
            "type":"web_url",
            "url":"https://www.messenger.com",
            "title":"Visit Messenger"
        },
        {
            "type": "postback",
            "title": "download link",
            "payload": "Ok"
        },
        {
            "type": "postback",
            "title": "I love this",
            "payload": "Well"
        }
        ]}
        ]}
    }
  } 
   request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
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