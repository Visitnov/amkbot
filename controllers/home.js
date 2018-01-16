var express = require('express');
var router = express.Router();
var request = require('request');
var json,err;
var human = 0;
var recipientId,senderId;
var qCount=1;
var probability = 16;
var cc = false;
//console.log("Inside home.js");
var roomModel = require('../models/roomModel2');
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
//main logic

var q2 = 'လြန္ခဲ့ေသာ၃လအတြင္း အကာအကြယ္မဲ့ လိင္ ဆက္ဆံျခင္းရွိခဲ့ပါသလား'; //q1
var q3 = 'လြန္ခဲ့ေသာ၃လအတြင္း ကိုယ္ပူခ်ိန္ ၁၀၂ ဒီဂရီခန္႔ထိရွိေသာ ဖ်ားနာျခင္းမ်ိဳးရွိခဲ့ပါသလား'; //q2
var q4 = 'မၾကာခဏင္ပပန္းႏြယ္နယ္မႈကို ခံစားရျခင္း ႏွင့္ အားမရွိသလိုျဖစ္ျခင္းမ်ိဳး ခံစားခဲ့ရပါလား'; //q3
var q5 = 'ႂကြက္သားနွင့္အရိုးအဆက္မ်ားနာက်င္ျခင္း အႀကိတ္မ်ားေယာင္ယမ္းျခင္း မ်ိဳးရွိခဲ့ပါသလား'; //q4
var q6 = 'မၾကာခဏ ေခါင္းကိုက္ျခင္းနွင့္ လည္ေခ်ာင္းနာျခင္းမ်ိဳးခံစားခဲ့ရပါသလား'; //q5
var q7 = 'မၾကာခဏ ဝမ္းေလ်ွာမႈျဖစ္ျခင္း၊  ေအာ့အံျခင္း၊ အေပၚယံအေရျပားယားယံျခင္း တို႔ျဖစ္ေပၚခဲ့ပါသလား'; //q6 & q7
var q8 = 'ကိုယ္အေလးခ်ိန္ သိသိသာသာက်သြားျခင္းမ်ိဳး ႀကံဳေတြ႕ခဲ့ရပါသလား'; // q8
var q9 = 'ရက္ ရွည္ၾကာစြာေခ်ာင္းဆိုးျခင္း နွင့္ အသက္ ရွဴရခက္ခဲျခင္းမ်ိဳးႀကံဳေတြ႕ခံစားခဲ့ရပါသလား'; // q9 & q10
var q10= 'ညဖက္ေခ်ြးထြက္မ်ားျခင္းမ်ား ႀကံဳေတြ႕ခဲ့ရပါသလား။'; // q11
var q11= 'လက္သဲပံုစံေျပာင္းလာျခင္း (လက္သဲခြံထူလာျခင္း၊ကြဲအက္ျခင္း၊အေရာင္ေျပာင္းျခင္း) မ်ိဳးႀကံဳေတြ႕ခဲ့ရပါသလား'; //q12
var q12= 'လိင္ အဂၤါယားယံျခင္း နာက်င္ျခင္း အနံ႔ဆိုးထြက္ျခင္းတို႔ႀကံဳေတြ႕ခဲ့ရပါသလား';//q13
var q14= 'အာရံုုစိုက္ ရခက္ခဲျခင္း ၊ လက္တြင္ အင္အားမရွိသကဲ့သို႔ခံစားရျခင္း မ်ိဳးႀကံဳေတြ႕ရျခင္း ရွိခဲ့ပါသလား'; // q14 & q15
var q15= 'နႈတ္ခမ္းတဝိုက္တြင္ ေရယံုေပါက္ျခင္းနွင့္ အျဖဴေရာင္ အကြက္မ်ားေပၚျခင္း၊ အနီေရာင္အဖုမ်ားထျခင္း၊ ညေနေေစာင္းအခ်ိန္မ်ားတြင္ ကိုယ္ပူ၍ေနထိုင္ မေကာင္းျဖစ္ျခင္းမ်ား ႀကံဳေတြ႕ခဲ့ရျခင္း ရွိခဲ့ပါသလား';//q16
var q16= 'လြန္ခဲ့ေသာ ၃လအတြင္း hiv ကူးဆက္ခံရႏုိင္ေျခရွိသည့္ အျပဳအမူ မ်ိဳးလုပ္ေဆာင္ ခဲ့ျခင္းရွိပါသလား။ (ေဆးထိုးအပ္ကိုမ်ွေဝသံုးဆြဲျခင္း၊ အကာအကြယ္မဲ့ လိင္တူ လိင္ကြဲ ဆက္ဆံျခင္း၊ )';//q17
var requestNext = '​​ေနာက္​တစ္​ၾကမ္​္​​စစ္​ၾကည္​့ခ်င္​​ေသးရင္​ Test လို႔ရိုက္​ပါ'; 
router.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        recipientId = event.recipient.id;
        senderId = event.sender.id; 
        console.log("senderId : "+senderId);      
        var unknownText ='I am a bot:အလုိအေလ်ာက္ေျဖၾကားေပးေနတာျဖစ္တဲ့အတြက္သတ္မွတ္ေမးခြန္းမ်ားသာျပန္ေျဖေပးမွာျဖစ္ပါတယ္';
        if (event.message) 
        {
          if(human == 0){
            if (event.message.text || event.message.quick_reply) {
                if (event.message.quick_reply) {
                    calculateTest(senderId,event.message.quick_reply.payload);
                    //sendMessage(senderId, {text: requestNext});
                    //console.log("1");
                }
                else if (!sendQuestions(recipientId, event.message.text)) {
                    sendMessage(senderId, {text: unknownText});
                }
                //console.log("event.message.text : " + JSON.stringify(event.message.text));
            }
            // else if (err) {
            // sendMessage(event.sender.id, {text: apiErrorText});
            // }
          }
        }else if (event.postback) {
          
          if (event.postback.payload == "gsButton") {
                var jsonName;
                request({
                  //https://graph.facebook.com/v2.6/<USER_ID>?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=PAGE_ACCESS_TOKEN
                  url: 'https://graph.facebook.com/v2.6/'+senderId+'?fields=first_name,last_name',
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
                    //console.log('username request fName : ', jsonName["first_name"]);
                    //fName =  jsonName["first_name"];
                    //lNname=  jsonName["last_name"];
                    var welcomeTextGS = {
                      "text":"​မဂၤလာပါ "+jsonName["first_name"]+" "+jsonName["last_name"]+" ။ က်ြန္​​ေတာ္​က Mr.Red ပါ။ မိတ္​​ေဆ​ြမွာ Hiv ဗိုင္​းရပ္​စ္​ ကူးဆက္​ခံထားရနိုင္​​ေျခ ရွိမရွိကို အႀကံျပဳ​ေျဖၾကား​ေပးမယ္​့ Bot ပါ။အဆင္​သင္​့ျဖစ္​ၿပီဆိုရင္​ ​ေအာက္​က​ေမးခြန္​း​ေတြကို YES သို႔မဟုတ္​ NO နွိပ္​ၿပီး​ေျဖဆို​ေပးပါ။ လြန္​ခဲ့​ေသာ ၃လအတြင္​း ​ေသြးသြင္​း၍ကုသခံရျခင္​းရွိခဲ့ပါသလား", //ေဈးသိခ်င္​တဲ့ ​ေငြ​ေၾကးအမ်ိဳးအစားကို​ေ႐ြး​ေပးပါ choose currency type 
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
                      sendMessage(senderId, welcomeTextGS);
                });
          }else if(event.postback.payload == "menu_chat_human"){
            human = 1;
            sendMessage(senderId, {text: "Page ​admin ကို​ေျပာခ်င္​တဲ့စကားရွိရင္​ ဒီမွာခ်န္​ထားခဲ့ႏိုင္​ပါတယ္​။ Bot ကိုျပန္​​ေျပာခ်င္​ရင္​​ေတာ့ Menu မွာ Chat with Bot ကို​ႏွိပ္​ပါ။" });
            //console.log("Postback received: " + JSON.stringify(event.postback));
          }else if (event.postback.payload == "menu_chat_bot") {
            human = 0;
            sendMessage(senderId, {text: "Hi လို႔ရိုက္​ၿပီး Bot နဲ႔စတင္​စကား​ေျပာနိုင္​ပါၿပီ" });
          }
        }
         
    }
    res.sendStatus(200);
}); 

//Send Quick Reply
function sendQuestions(recipientId, text) {
    
        text = text.toUpperCase();
        if (text === "GET TESTED") {
            sendMessage(senderId, {text: "Hi! I'm Mr.Reddy. I am here to help you get tested for hiv by asking you some health related questions in Burmese language. If you are ready, just type 'Hello'" });
            return true;       
        }
        else if (text.length < 6 ) {
            var welcomeTextQ1 = {
                "text":"​မဂၤလာပါ။ က်ြန္​​ေတာ္​က Mr.Red ပါ။ မိတ္​​ေဆ​ြမွာ Hiv ဗိုင္​းရပ္​စ္​ ကူးဆက္​ခံထားရနိုင္​​ေျခ ရွိမရွိကို အႀကံျပဳ​ေျဖၾကား​ေပးမယ္​့ Bot ပါ။အဆင္​သင္​့ျဖစ္​ၿပီဆိုရင္​ ​ေအာက္​က​ေမးခြန္​း​ေတြကို YES သို႔မဟုတ္​ NO နွိပ္​ၿပီး​ေျဖဆို​ေပးပါ။ လြန္​ခဲ့​ေသာ ၃လအတြင္​း ​ေသြးသြင္​း၍ကုသခံရျခင္​းရွိခဲ့ပါသလား", //ေဈးသိခ်င္​တဲ့ ​ေငြ​ေၾကးအမ်ိဳးအစားကို​ေ႐ြး​ေပးပါ choose currency type 
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
            sendMessage(senderId, welcomeTextQ1);       
            return true;
        }
        return false;         
}

function calculateTest(recipient,answer){
    var isCompletedQuestions = false ;
    var question;
    var q;
    if (qCount == 16) {
        isCompletedQuestions=true;
    }
    if (answer === "NO"){
        probability -= 1;
    }else if(answer === "YES"){
        cc =true;
    }
    qCount++;
    if (qCount <= 16) {
        q = qCount;
    }

    switch (q) {
    case 2: question = {
                "text": q2, 
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
                ]
                }
        break;
    case 3: question = {
                "text": q3, 
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
                ]
                }
        break;
    case 4: question = {
                "text": q4, 
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
                ]
                }
        break;
    case 5: question = {
                "text": q5, 
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
                ]
                }
        break;
    case 6: question = {
                "text": q6, 
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
                ]
                }
        break;
    case 7: question = {
                "text": q7, 
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
                ]
                }
        break;
    case 8: question = {
                "text": q8, 
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
                ]
                }
        break;
    case 9: question = {
                "text": q9, 
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
                ]
                }
        break;
    case 10: question = {
                "text": q10, 
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
                ]
                }
        break;
    case 11: question = {
                "text": q11, 
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
                ]
                }
        break;
    case 12: question = {
                "text": q12, 
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
                ]
                }
        break;
    case 13: question = {
                "text": q13, 
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
                ]
                }
        break;
    case 14: question = {
                "text": q14, 
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
                ]
                }
        break;
    case 15: question = {
                "text": q15, 
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
                ]
                }
        break; 
    case 16: question = {
                "text": q16, 
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
                ]
                }
              cc = true;  
        break;               
    }
    if (!isCompletedQuestions) {
        sendMessage(recipient, question);
    }else{
        var result = probability/16*100 ;
        if (result > 0 && result <= 50) {
            sendMessage(recipient, {text: "မိတ္​​ေဆြတြင္​ hiv ကူးစက္​ခံထားရနိုင္​​ေျခ " +result+" % ရွိ​ေနပါသည္​။ နီးစပ္​ရာ ​ေဆးရံု၊ ​ေဆး​ခန္​း နွင္​့​ေရာဂါရွာ​ေဖြ​ေရး​ေဆးခန္​းမ်ားတြင္​ hiv ​စစ္​​ေဆးမႈခံယူၾကည္​့ပါ။" });//low condition 
        }else if (result > 0 && result <= 50 && cc) {
            sendMessage(recipient, {text: "မိတ္​​ေဆြတြင္​ hiv ကူးစက္​ခံထားရနိုင္​​ေျခ " +result+" % ထိရွိ​ေနပါသည္​။ နီးစပ္​ရာ ​ေဆးရံု၊ ​ေဆး​ခန္​း နွင္​့​ေရာဂါရွာ​ေဖြ​ေရး​ေဆးခန္​းမ်ားတြင္​ hiv  ​စစ္​​ေဆးမႈ အျမန္​ဆံုးခံယူၾကည္​့ရန္​တိုက္​တြန္​းပါသည္​။" });//medium condition 
        }else if (result > 50 && cc) {
            sendMessage(recipient, {text: "မိတ္​​ေဆြတြင္​ hiv ကူးစက္​ခံထားရနိုင္​​ေျခ " +result+" % ထိရွိ​ေနသျဖင္​့ နီးစပ္​ရာ ​ေဆးရံု၊ ​ေဆး​ခန္​း နွင္​့​ေရာဂါရွာ​ေဖြ​ေရး​ေဆးခန္​းမ်ားတြင္​ မျဖစ္​မ​ေန hiv ​စစ္​​ေဆးမႈခံယူၾကည္​့ရန္​ ​ေလး​ေလးနက္​နက္​တိုက္​တြန္​းပါရ​ေစ။" });//critical condition 
        }else{
            sendMessage(recipient, {text: "ဝမ္​းသာပါတယ္​မိတ္​​ေဆြ။ မိတ္​​ေဆြတြင္​ hiv ကူးစက္​ခံထားရနိုင္​​ေျခ အလြန္​နဲပါးသည္​ဟုသံုးသပ္​ရပါသည္​။ သို႔ရာတြင္​ သံသယတစ္​စံုတစ္​ရာ ရွိ​ေနပါက ​ေဆးစစ္​မႈခံယူရန္​ အႀကံျပဳပါသည္​။" });//zero condition 
        }
        qCount =1;
        probability =16;
        isCompletedQuestions = false ;
        cc = false;
        sendMessage(recipient, {text: requestNext});
    }
    
    //return true;
}

// router.get('/room/getRoomPlayers', function(req, res) {
// 	var userId = req.query.userId;
// 	var userToken = req.query.userToken;
// 	var roomId = req.query.roomId;
// 	userService.getUserFromToken(userId,userToken,function(err,user){
// 		if(err){
// 			console.log("getUserFromToken err");
// 			console.log(err);
// 			res.json(err);
// 		}else{
// 			roomModel.getRoomPlayers(roomId,function(err,data){
// 				if(err){
// 					console.log("getRoomPlayers err");
// 					res.json(err);
// 				}else{
// 					res.json(data);
// 				}
// 			});	
// 		}
// 	});		
// });
module.exports = router;