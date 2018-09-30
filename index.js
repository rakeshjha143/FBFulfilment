//const Twitter = require('twitter');
const Sentiment = require('sentiment');
var express = require('express');
var session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var requestAPI = require('request');
const uuidv1 = require('uuid/v1');
const nodemailer = require('nodemailer');
let fs = require('fs');
var async = require('async');
var commonFiles = require('./util/commonfiles');
var addressify = require('./util/addressify').checkAddressify;

// mongoose.connect('mongodb://admin:admin123@ec2-18-232-207-49.compute-1.amazonaws.com/admin', {
//   useMongoClient: true
// }, (err, db) => {
//   if (err) {
//     console.log('err', err);

//   }
//   else { console.log('Connected', db) }

// });
// mongoose.Promise = global.Promise;
// const db = mongoose.connection

// const config = {
//   consumer_key: process.env.consumer_key,
//   consumer_secret: process.env.consumer_secret,
//   access_token_key: process.env.access_token,
//   access_token_secret: process.env.access_token_secret
//   // consumer_key: 'asdasdasdasdasdasd',
//   // consumer_secret: 'asdasdasdasdasd',
//   // access_token_key: 'asdasdasdasdasd',
//   // access_token_secret: 'asdasdasdasda'
// };

//const tweet = new Twitter(config);
const sentiment = new Sentiment();

// const params = {
//   // q: '"#optus" OR "OPTUS" OR "Optus" ',
//   screen_name: 'Iamcharlotte7',
//   count: 20,
//   result_type: 'recent',
//   lang: 'en',
//   tweet_mode: 'extended'
// }
// const csparams = {
//   // q: '"#optus" OR "OPTUS" OR "Optus" ',
//   //screen_name: 'Iamcharlotte7',
//   //screen_name: 'arunprasaath_r',
//   screen_name: 'IIFLMarkets',
//   count: 20,
//   result_type: 'recent',
//   lang: 'en',
//   tweet_mode: 'extended'
// }
// const csfparams = {
//   // q: '"#optus" OR "OPTUS" OR "Optus" ',
//   //screen_name: 'Iamcharlotte7',
//   //screen_name: 'arunprasaath_r',
//   screen_name: 'IIFLMarkets',
//   count: 20,
//   result_type: 'recent',
//   lang: 'en',
//   tweet_mode: 'extended'
// }

// function callTwitterFeed() {
//   return new Promise((resolve, reject) => {
//     var finalTweet = []; //search/tweets
//     tweet.get('statuses/user_timeline', params, function (err, data, response) {
//       if (!err) {
//         console.log('into twitter == ',data);
//         //resolve(data);
//         var filteredTweetArr = data.filter(function (tweetObj) {
//           var createdDate = new Date(tweetObj.created_at);
//           var todayDate = new Date();
//           var Difftime = Math.abs(todayDate.getTime() - createdDate.getTime());
//           var diffDays = Math.ceil(Difftime / (1000 * 3600 * 24));
//           tweetObj.dayDiff = diffDays;

//           return tweetObj.dayDiff <= 2;
//         });
//         // console.log(filteredTweetArr);

//         filteredTweetArr.forEach(element => {

//           var sentence = element.full_text;
//           var text = /(insurance)|(health)|(feeling)/i;
//           var validTweetChkIndex = sentence.search(text);
//           console.log('validTweetChkIndex',validTweetChkIndex);
//           if (validTweetChkIndex !== -1) {
//             finalTweet.push({
//               //'userID': 'Iamcharlotte7',
//               'userID': 'Iamcharlotte7',
//               'text': sentence,
//               'keyword': 'health',
//               'sentimentScore': sentiment.analyze(sentence)
//             });
//           }
//         });

//         // console.log(finalTweet);

//         resolve(finalTweet);
//       } else {
//         console.log('out twitter == ',err);
//         reject(err);
//       }
//     })
//   })
// }
// function callCSTwitterFeed(twitterHandle) {
//   if(twitterHandle!='')
//   csparams.screen_name = twitterHandle;
//   return new Promise((resolve, reject) => {
//     var finalTweet = []; //search/tweets
//     tweet.get('statuses/user_timeline', csparams, function (err, data, response) {
//       if (!err) {
//         //console.log('into twitter == ',data);
//         //resolve(data);
//         var filteredTweetArr = data.filter(function (tweetObj) {
//           var createdDate = new Date(tweetObj.created_at);
//           var todayDate = new Date();
//           var Difftime = Math.abs(todayDate.getTime() - createdDate.getTime());
//           var diffDays = Math.ceil(Difftime / (1000 * 3600 * 24));
//           tweetObj.dayDiff = diffDays;

//           return tweetObj.dayDiff <= 2;
//         });
//         // console.log(filteredTweetArr);

//         filteredTweetArr.forEach(element => {

//           var sentence = element.full_text;
//           var text = /(Bond)|(Tender offer)|(Instrument)|(Hedge fund)|(Money)|(New fund offer)|(Growth)|(stake)|(Stocks)|(NFO)|(Performance	)|(Launch)|(Market)|(Regulation)|(Buy)|(Mortgage)|(Sell)|(Retirement Plan)|(Mutual Fund)|(Financial Aid)|(Advise)|(Return on Investment)|(Advisor	RO)|(Portfolio)|(Asset)|(Manage)|(Wealth)|(Banking)|(Bank)|(Insurance)/i;
//           var validTweetChkIndex = sentence.search(text);
//           console.log('validTweetChkIndex',validTweetChkIndex);
//           if (validTweetChkIndex !== -1) {
//             finalTweet.push(element);
//           }
//         });

//         // console.log(finalTweet);
//         if(finalTweet == '')
//         {
//           finalTweet = 'empty';
//         }
//         resolve(finalTweet);
//       } else {
//         finalTweet = 'empty';
//         console.log('out twitter == ',err);
//         resolve(finalTweet);
//         //reject(err);
//       }
//     })
//   })
// }
// function callCSTwitterFriends(twitterHandle) {
//   if(twitterHandle!='')
//   csfparams.screen_name = twitterHandle;
//   return new Promise((resolve, reject) => {
//     var finalTweet = []; //search/tweets
//     tweet.get('friends/list', csfparams, function (err, data, response) {
//       if (!err) {
//         //console.log('into twitter == ',data);
        
//         // var filteredTweetArr = data.filter(function (tweetObj) {
//         //   var createdDate = new Date(tweetObj.created_at);
//         //   var todayDate = new Date();
//         //   var Difftime = Math.abs(todayDate.getTime() - createdDate.getTime());
//         //   var diffDays = Math.ceil(Difftime / (1000 * 3600 * 24));
//         //   tweetObj.dayDiff = diffDays;

//         //   return tweetObj.dayDiff <= 2;
//         // });
//         // // console.log(filteredTweetArr);

//         // filteredTweetArr.forEach(element => {

//         //   var sentence = element.full_text;
//         //   var text = /(Bond)|(Tender offer)|(Instrument)|(Hedge fund)|(Money)|(New fund offer)|(Growth)|(stake)|(Stocks)|(NFO)|(Performance	)|(Launch)|(Market)|(Regulation)|(Buy)|(Mortgage)|(Sell)|(Retirement Plan)|(Mutual Fund)|(Financial Aid)|(Advise)|(Return on Investment)|(Advisor	RO)|(Portfolio)|(Asset)|(Manage)|(Wealth)|(Banking)|(Bank)|(Insurance)/i;
//         //   var validTweetChkIndex = sentence.search(text);
//         //   console.log('validTweetChkIndex',validTweetChkIndex);
//         //   if (validTweetChkIndex !== -1) {
//         //     finalTweet.push(element);
//         //   }
//         // });

//         // console.log(finalTweet);
//         if(data == '')
//         {
//           data = 'empty';
//         }
//         resolve(data);
//       } else {
//         data = 'empty';
//         console.log('out twitter == ',err);
//         resolve(data);
//         //reject(err);
//       }
//     })
//   })
// }
app = express();
//Create express object

var port = process.env.PORT || 5000;
//Assign port
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('trust proxy', 1) // trust first proxy
// app.use(session({
//   secret: 'keyboard cat',
//   store: new MongoStore({
//     mongooseConnection: db,
//     autoRemove: 'interval',
//     autoRemoveInterval: 60 * 24
//   }),
//   resave: true, saveUninitialized: true,
//   cookie: { path: '/', httpOnly: false, secure: false, maxAge: 24 * 60 * 60 * 1000 }
// }))
//Configuring express app behaviour
app.get("/ally", async function (req, res) {
  var profile = new commonFiles.profile();
  console.log(profile);
  res.json(profile);
  
});
// app.get("/charlesTweetFeed", async function (req, res) {
//   if(req.query.twitter != 'undefined')
//     var twitterHandle = req.query.twitter;
//   else
//     var twitterHandle = 'null'; 
//   let twitterData = await callCSTwitterFeed(twitterHandle);
//   if(twitterData == 'empty')
//     res.json({result:"empty tweet or account not found"});
//   else
//     res.json(twitterData);
// });
// app.get("/charlesTweetFriends", async function (req, res) {
//   if(req.query.twitter != 'undefined')
//     var twitterHandle = req.query.twitter;
//   else
//     var twitterHandle = 'null'; 
//   let twitterData = await callCSTwitterFriends(twitterHandle);
//   if(twitterData == 'empty')
//     res.json({result:"empty tweet or account not found"});
//   else
//     res.json(twitterData);
// });


const readFileSession = filePath => new Promise((resolve, reject) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});
app.post("/updatesession", async function (req, res) {
  console.log(req.body.sessionID);
  try {
    readFileSession('sessionID.json').then(async function (file) {
      console.log("--------file-------------");
      console.log(file);
      if (file) {
        let data = JSON.parse(file);
        console.log("---------------data------------------");
        console.log(data);
        let obj = data.find(x => x.sessionID === req.body.sessionID);
        let index = data.indexOf(obj);
        console.log("-------------index--------------------");
        console.log(index);
        if (index == -1) {
          data.push({ "type": req.body.type, "sessionID": req.body.sessionID });
          await fs.writeFile("sessionID.json", JSON.stringify(data), { encodig: "utf8" }, function () { })
        }
        else {
          data[index]["type"] = req.body.type;
          await fs.writeFile("sessionID.json", JSON.stringify(data), { encodig: "utf8" }, function () { })
        }

      }
      else {
        await fs.writeFile("sessionID.json", JSON.stringify([{ "type": req.body.type, "sessionID": req.body.sessionID }]), { encodig: "utf8" }, function () {

        })
      }

    }).catch(function (err) {
      console.log(err)
    });

  }

  catch (err) { console.error(err) }
  res.send(req.body.sessionID);
});
//GET Endpoint
let linestatus;
let line1 = "52, Scenic Road";
let line2 = "SUMMER ISLAND, NSW 2440";
let line3 = "Australia";
var getDetails;
var newQuoteobj = '';
newQuoteobj = new commonFiles.newQuote();
getDetails = new commonFiles.getDetails();
var profileDetails = new commonFiles.profileDetails()
var latestSN = new commonFiles.latestSN();
app.post("/allyfulfillment", async function (req, res) {

  // Service now status
  
  console.log("body", JSON.stringify(req.body));
  console.log(JSON.stringify(req.body.result.action));
  var sessionId = req.body.sessionId;
  console.log("sessionId", sessionId);
  console.log('Inside Ally API');
  let intentFrom = req.body.result.action;
  let intentQuery = req.body.result.resolvedQuery;
  let intentParam = req.body.result.parameters;
  var objData = null;
  var type = null;
  var smsType = null;
  var smsContent = '';
  var resp = commonFiles.WelcomeMsg();
  var msg = '';
  // var q = new Date();
  // var m = q.getMonth()+1;
  // var d = q.getDate();
  // var y = q.getFullYear();
  
  // var Cdate = new Date(y,m,d);
  //Cdate.setDate(Cdate.getDate() - profileDetails.diff); 
  var objDaDif = [];    
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  
  function dateDiffInDays(a, b) {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }  
  for (let i in profileDetails.details) {
    var a = new Date();
    var b = new Date(profileDetails.details[i].vehicle_date);
    var diff = dateDiffInDays(a,b);
    objDaDif.push(diff);
  }
  var indexOfMaxValue = objDaDif.reduce((iMax, x, i, arr) => x < arr[iMax] ? i : iMax, 0);
  Date.prototype.addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
  }

  var date = new Date();

  var Cdate = date.addDays(profileDetails.details[indexOfMaxValue].diff);
  //Cdate.setDate(Cdate.getDate() - profileDetails.details[indexOfMaxValue].diff);
  //Cdate.setDate(Cdate.getDate() - profileDetails.details[indexOfMaxValue].user_vehicle); 
  // if (intentFrom == 'Optus') {
  //   res.send({
  //     speech: "Redirecting to LE",
  //   });
  // } else
  if (intentFrom === 'call-gen-response-final') {
    res.send({
      speech: "",
      displayText: "",
      actionIncomplete: false,
      followupEvent: {
        name: "gen-response-final"
      }
    });
    
  } else if (intentFrom === 'input.welcome' || (intentFrom === 'AccidentIntimation-yes-yes-final' && intentQuery.includes('ye'))) {
    resp += "I’m Ally, your assistant in Allianz. How may I help you?";
    msg = {
      "speech": "",
      "messages": [{
        "type": 4,
        "platform": "facebook",
        "payload": {
          "facebook": {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "generic",
                "elements": [{
                  "title": "",
                  "image_url": "https://www.allianz.com/v_1465855200000/images/logos/Allianz-Logo.jpg",
                  "subtitle": resp,
                  "buttons": [
                    {
                      "postback": "Accident intimation",
                      "text": "Accident intimation"
                    },
                    {
                      "postback": "Enquire Plan Expiry",
                      "text": "Enquire Plan Expiry"
                    },
                    {
                      "postback": "Get quote",
                      "text": "Get quote"
                    }
                  ]
                }]
              }
            }
          }
        }
      }]
    };

    return res.json(msg);
  } else if (intentFrom === 'GetQuote') {

    msg = {
      "speech": "",
      "displayText": "",
      "messages": [{
        "type": 4,
        "platform": "facebook",
        "payload": {
          "facebook": {
            "text": `Please choose the option`,
            "quick_replies": [{
              "content_type": "text",
              "title": "Motor insurance",
              "payload": "Motor insurance"
            },
            {
              "content_type": "text",
              "title": "Home Insurance",
              "payload": ""
            },
            {
              "content_type": "text",
              "title": "Health Insurance",
              "payload": ""
            }
            ]
          }
        }
      }]
    };
    return res.json(msg);
  } else if (intentFrom === 'AccidentIntimation') {
    
    msg = {
      "speech": "",
      "displayText": "",
      "messages": [{
        "type": 4,
        "platform": "facebook",
        "payload": {
          "facebook": {
            "text": `Oh! That’s unfortunate. Hope you are fine. Please choose which vehicle`,
            "quick_replies": [{
              "content_type": "text",
              "title": "TN 01 AB – 1234, Swift",
              "payload": "TN-01-AB-1234"
            },
            {
              "content_type": "text",
              "title": "TN 01 F – 8966, Polo",
              "payload": "TN-01-F-8966"
            }
            ]
          }
        }
      }]
    };
    res.json(msg);

  // } else if (intentFrom === 'AccidentIntimation-yes-no') {

  //   msg = {
  //     "speech": "",
  //     "displayText": "",
  //     "messages": [{
  //       "type": 0,
  //       "platform": "facebook",
  //       "speech": "Sorry, Without garage details i can't proceed further."
  //     }],
  //     contextOut: [{
  //       "name": "AccidentIntimation-yes-followup",
  //       "lifespan": 1,
  //       "parameters": {}
  //     }]
  //   };
  //   res.json(msg);

  } else if (intentFrom === 'AccidentIntimation-yes') {

    if (intentQuery.includes("1234") || intentQuery.includes("swift")) {
      getDetails.u_vehicle = 'TN-01-AB-1234';
    } else if (intentQuery.includes("8966") || intentQuery.includes("polo")) {
      getDetails.u_vehicle = 'TN-01-F-8966';
    }
    msg = {
      "speech": "",
      "displayText": "",
      "messages": [{
        "type": 0,
        "platform": "facebook",
        "speech": "Is the car in garage already"
      }]
      // "messages": [{
      //   "type": 4,
      //   "platform": "facebook",
      //   "payload": {
      //     "facebook": {
      //       "text": `Is the car in garage already?`,
      //       // "quick_replies": [{
      //       //   "content_type": "text",
      //       //   "title": "Yes",
      //       //   "payload": "Yes"
      //       // },
      //       // {
      //       //   "content_type": "text",
      //       //   "title": "No",
      //       //   "payload": "No"
      //       // }
      //       // ]
      //     }
      //   }
      // }]
    };
    return res.json(msg);
  } else if(intentFrom === 'No-Garage-Followup-yes'){

    let garage = req.body.result.parameters.garage;
    getDetails.u_garage = garage;

    // New service request call
    var typeP = 'SERVICEREQUESTPATCH';
    var status = {
      u_status: 'Inspection Inprogress',
      u_garage:getDetails.u_garage
      };
    console.log('************latestSN.sys_id ***************',latestSN.sys_id);
    var type = 'GETPLAN';
  commonFiles.getServiceNowIncidents(type, 'u_name=Mukil', function (error, data) {
    console.log('data', data);
    latestSN.sr_no = data.result[0].u_number;
    latestSN.sr_status = data.result[0].u_status;
    latestSN.sys_id = data.result[0].sys_id;
    commonFiles.callServiceNowApiPATCH(JSON.parse(JSON.stringify(status)), typeP,latestSN.sys_id ,function (error, data) {
      console.log('error -----------------',error);
      console.log('data -----------------',data);
      res.send({
        speech: "Thanks, Your Garage details are updated, Your request for inspection(SR #" + latestSN.sr_no + " ) is <b>Inspection Inprogress</b>. The inspection will be completed within the next 4 hrs. Is there anything else i can help you with?",
      });
    }); 
  });
    
       
    

  }else if (intentFrom === 'AccidentIntimation-yes-yes' || intentFrom === 'AccidentIntimation-yes-no') {

    let garage = req.body.result.parameters.garage;
    let date = req.body.result.parameters.date;
    let time = req.body.result.parameters.time;
    //let date_time = req.body.result.parameters.date-time;
    getDetails.u_garage = garage;
    getDetails.u_date = date;
    getDetails.u_time = time;
    //add service now code here
    res.send({
      speech: "Is there anyone hospitalized with injury?",
    });

  } else if (intentFrom === 'AccidentIntimation-yes-yes-injury' || intentFrom === 'AccidentIntimation-yes-no-injury') {

    let injury = req.body.result.parameters.injury;
    //let date_time = req.body.result.parameters.date-time;
    getDetails.u_injury = injury;
    //getDetails.u_datetime = date_time;
    //add service now code here
    msg = {
      "speech": "",
      "displayText": "",
      "messages": [{
        "type": 4,
        "platform": "facebook",
        "payload": {
          "facebook": {
            "text": `FIR is registered?`,
            "quick_replies": [{
              "content_type": "text",
              "title": "Yes",
              "payload": "Yes"
            },
            {
              "content_type": "text",
              "title": "No",
              "payload": "No"
            },
            {
              "content_type": "text",
              "title": "Help",
              "payload": "liveperson"
            }
            ]
          }
        }
      }]
    };
    res.json(msg);
  // } else if(intentFrom === 'No-Garage-Followup') {
  //   var type = 'GETPLAN';
  // commonFiles.getServiceNowIncidents(type, 'u_name=Mukil', function (error, data) {
  //   console.log('data', data);
  //   var SRID = data.result[0].u_number;
  //   var status = data.result[0].u_status;
  //   var msg = '';
  //   msg = {
  //     "speech": "",
  //     "displayText": "",
  //     "messages": [{
  //       "type": 0,
  //       "platform": "facebook",
  //       "speech": "Good Morning Mukil! Your request for inspection(" + SRID + ")is " + status + ". Is there anything else i can help you with?"
  //     }]
  //   };
  //   return res.json(msg);
  // });
    // callServiceNowApi("https://dev27698.service-now.com/api/now/table/u_servicerequest?sysparm_limit=1&sysparm_query=ORDERBYDESCsys_created_on&u_name=Mukil", null, "GET", function (err, data) {
    //   res.send(data);
    // })
    // `Hi Mukil!!. The status for your claim request (SR #` + SRID + `) is <b>` + status + `</b>. Is there anything else I can help you with?` 
  } else if (intentFrom === 'AccidentIntimation-yes-yes-fir' || intentFrom === 'AccidentIntimation-yes-no-fir') {

    let fir = req.body.result.parameters.fir;
    getDetails.u_fir = fir;
    if(fir == 'no') {     
      var type = 'SERVICEREQUEST';
      if(intentFrom === 'AccidentIntimation-yes-no-fir') {
        getDetails.u_status = 'No Garage';
        commonFiles.callServiceNowApi(JSON.parse(JSON.stringify(getDetails)), type, function (error, data) {
          let SRID = data.result.u_number;
        var msgspeech = [{
          "type": 0,
          "platform": "facebook",
          "speech": "OK, Please call 020-66439001/2/3 to locate preferred garage."
        },
        {
          "type": 0,
          "platform": "facebook",
          "speech": `I’ve taken down the request. You need to place your vehicle in any one of the preferred garage and update garage details with us to complete the service request. After garage details updated, inspector will visit the garage for further processing of the service request. Your reference number # is SR: ${SRID}. Is there anything else I can help you with?`
        }];
        msg = {
          "speech": "",
          "displayText": "",
          "messages": msgspeech
          };
          console.log('uDetails -- ', getDetails);
          return res.json(msg);
        });
      } else {
        commonFiles.callServiceNowApi(JSON.parse(JSON.stringify(getDetails)), type, function (error, data) {
        let SRID = data.result.u_number;
        
          var msgspeech = [{
            "type": 0,
            "platform": "facebook",
            "speech": `OK, I’ve taken down the request. Our inspector will visit the garage within 4 hrs. Your intimation # is SR: ${SRID}. Is there anything else I can help you with?`
          }];
          msg = {
            "speech": "",
            "displayText": "",
            "messages": msgspeech
            };
            console.log('uDetails -- ', getDetails);
            return res.json(msg);
        
        });
      }
    } else {
      res.send({
        speech: "Please provide the FIR number",
      });
    }
  } else if (intentFrom === 'AccidentIntimation-yes-yes-fir-yes-fir' || intentFrom === 'AccidentIntimation-yes-no-fir-yes-fir') {

    let u_firno = req.body.result.parameters.firno;
    
      getDetails.u_firno = u_firno;
      var type = 'SERVICEREQUEST';
      commonFiles.callServiceNowApi(JSON.parse(JSON.stringify(getDetails)), type, function (error, data) {
      let SRID = data.result.u_number;
      msg = {
      "speech": "",
      "displayText": "",
      "messages": [{
        "type": 0,
        "platform": "facebook",
        "speech": "OK, I’ve taken down the request. Our inspector will visit the garage within 4 hrs. Your intimation # is SR: " + SRID + ". Is there anything else I can help you with?"
      }]
      };
      console.log('uDetails -- ', getDetails);
      return res.json(msg);
      });
    
 
  } else if (intentFrom == "HomeInsurance-yes") {
    console.log("testerter");
    msg = {
      "speech": "",
      "displayText": "",
      "messages": [{
        "type": 1,
        "platform": "facebook",
        "title": "Agreed Value Basis",
        "subtitle": "<b>PLATINUM PLAN - I</b> <div style='font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;'><br> Flat/Apartment Insurance <br><br>- Agreed Basis + Contents <br>- New For Old (For Contents Up to 5 Years)</div>",
        "Url": "https://cryptic-fortress-41232.herokuapp.com/home-insurance",
        "imageUrl": "http://www.netshellinfosystem.com/wp-content/uploads/2016/06/plat2.png",
        "buttons": [{
          "text": "Select",
          "postback": "PLATINUM PLAN"
        }
        ]
      },
      {
        "type": 1,
        "platform": "facebook",
        "title": "Reinstatement Value Basis",
        "subtitle": "<b>DIAMOND PLAN -I</b> <div style='font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;'><br> Flat/Apartment/Building Insurance <br><br>- Reinstatement Basis + Contents<br>- New for Old (For Contents Up to 5 Years)</div>",
        "Url": "https://cryptic-fortress-41232.herokuapp.com/home-insurance",
        "imageUrl": "http://gslaundry.com.ng/wp-content/uploads/2018/03/diamond_opt.png",
        "buttons": [{
          "text": "Select",
          "postback": "DIAMOND PLAN"
        }
        ]
      },
      {
        "type": 1,
        "platform": "facebook",
        "title": "Indemnity Basis",
        "subtitle": "<b>GOLD PLAN -I</b> <div style='font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;'><br> Flat/Apartment/Building Insurance <br><br>- Indemnity Basis + Contents<br>- New for Old (For Contents Up to 5 Years)</div>",
        "Url": "https://cryptic-fortress-41232.herokuapp.com/home-insurance",
        "imageUrl": "https://i1.wp.com/www.bigbazarsale.com/wp-content/uploads/2018/03/gold-package.png",
        "buttons": [{
          "text": "Select",
          "postback": "GOLD PLAN"
        }
        ]
      }
      ]
    };

    return res.json(msg);
  } else if(intentFrom == "GetQuote-yes") {
    res.send({
      followupEvent: {
        name: "GetQuotestep1-event"
      }
    });
  }else if (intentFrom === 'GetQuote-step2') {
    
    var regvalue = intentParam.reg;
    console.log('GetQuote-step5 - newQuoteobj - ',JSON.stringify(newQuoteobj));
    //console.log('------------',/^[A-Z]{2}[ -][0-9]{1,2}[ -](?: [A-Z])?(?:[A-Z]*)?[ -][0-9]{1,4}$/gm.test(regvalue));
    if (!(/^[A-Z]{2}[ -][0-9]{1,2}[ -](?: [A-Z])?(?:[A-Z]*)?[ -][0-9]{1,4}$/gm.test(regvalue))) {
      //if(!regvalue) {
      res.send({
        speech: "Please provide your vehicle number in this format TN-01-AA-2322",
        // followupEvent: {
        //   name: "Quote-step1",
        //   data: {
        //     "reg": "",
        //   }
        // },
        contextOut: [{
          "name": "GetQuotestep1-followup",
          "lifespan": 1,
          "parameters": {}
        }]
      });
    } else {
      newQuoteobj.u_reg = intentParam.reg;
      res.send({
        speech: "Please provide your vehicle make (eg. Maruthi)",
      });
    }
  } else if (intentFrom === 'GetQuote-step3') {
    var make = intentParam.make;
    var model = intentParam.model;
    var variant = intentParam.variant;
    console.log('GetQuote-step3 - newQuoteobj - ',JSON.stringify(newQuoteobj));
    if (!make) {
      res.send({
        speech: "Please provide your vehicle make (eg. Maruthi)",
        // followupEvent: {
        //   name: "Quote-step1",
        //   data: {
        //     "reg": "",
        //   }
        // },
        contextOut: [{
          "name": "GetQuotestep2-followup",
          "lifespan": 1,
          "parameters": [{ "reg": newQuoteobj.u_reg }]
        }]
      });
    } else {
      newQuoteobj.u_make = make;
      newQuoteobj.u_model = model;
      newQuoteobj.u_variant = variant;
      res.send({
        speech: "Please provide your vehicle manufacturing year (eg. 2010)",
      });
    }
    // } else {
    //   newQuoteobj.u_make = intentParam.makemodel;
    //   res.send({
    //     speech: "Thanks! You will be receiving your quotation via email at the earliest! If you want to chat with live agent, please type 'help' at any time!",
    //     displayText: "",
    //     actionIncomplete:false
    //   });
    //   console.log('--newQuoteobj--',newQuoteobj);
    //   delete newQuoteobj;
    // }
  } else if (intentFrom === 'GetQuote-step4') {
    var year = intentParam.year;
    console.log('GetQuote-step4 - newQuoteobj - ',JSON.stringify(newQuoteobj));
    if (!year) {
      res.send({
        speech: "Please provide your vehicle manufacturing year (eg. 2010)",
        // followupEvent: {
        //   name: "Quote-step1",
        //   data: {
        //     "reg": "",
        //   }
        // },
        contextOut: [{
          "name": "GetQuotestep3-followup",
          "lifespan": 1,
          "parameters": [{ "reg": newQuoteobj.u_reg }, { "make": newQuoteobj.u_make }]
        }]
      });
    } else {
      newQuoteobj.u_year = intentParam.year;
      res.send({
        speech: "Provide your vehicle registration date",
      });
    }
  } else if (intentFrom === 'GetQuote-step5') {
    var regdate = intentParam.regdate;
    var u_year = newQuoteobj.u_year;
    console.log('GetQuote-step5 - newQuoteobj - ',JSON.stringify(newQuoteobj));
    console.log('----++++----',regdate.substring(0,4))
    if (u_year > regdate.substring(0,4) ) {
      res.send({
        speech: "Your vehicle registration date should be greater than vehicle manufacturer year! Please re-enter the correct registration date.",
        // followupEvent: {
        //   name: "Quote-step1",
        //   data: {
        //     "reg": "",
        //   }
        // },
        contextOut:[{
          "name":"getquotestep4-followup",
          "parameters":{"year":u_year,"year.original":u_year},
          "lifespan":1
        },
        {
          "name":"getquotestep5-followup",
          "lifespan":0
        }]
        // contextOut: [{
        //   "name": "GetQuotestep4-followup",
        //   "lifespan": 1,
        //   "parameters": [{ "reg": newQuoteobj.u_reg }, { "make": newQuoteobj.u_make }, { "year": newQuoteobj.u_year }]
        // },{
        //   "name": "GetQuotestep5-followup",
        //   "lifespan": 0,
        //   "parameters": [{ "reg": newQuoteobj.u_reg }, { "make": newQuoteobj.u_make }, { "year": newQuoteobj.u_year }]
        // }]
      });
    } else {
      newQuoteobj.u_date = intentParam.regdate;
      msg = {
        "speech": "",
        "displayText": "",
        "messages": [{
          "type": 4,
          "platform": "facebook",
          "payload": {
            "facebook": {
              "text": `Have you bought your vehicle on loan?`,
              "quick_replies": [{
                "content_type": "text",
                "title": "Yes",
                "payload": "Yes"
              },
              {
                "content_type": "text",
                "title": "No",
                "payload": "No"
              },
              {
                "content_type": "text",
                "title": "Help",
                "payload": "liveperson"
              }
              ]
            }
          }
        }]
      };
      res.json(msg);
    }
  } else if (intentFrom === 'GetQuote-step6') {
    var loan = intentQuery;
    console.log('--newQuoteobj--', newQuoteobj);
    newQuoteobj.u_loan = loan;

    //calculation for premium & IDV value
    // Not exceeding 6 months(5%)
    // Exceeding 6 months but not exceeding 1 year(15%)
    // Exceeding 1 year but not exceeding 2 years(20%)
    // Exceeding 2 years but not exceeding 3 years(30%)
    // Exceeding 3 years but not exceeding 4 years(40%)
    // Exceeding 4 years but not exceeding 5 years(50%)
    var myear = newQuoteobj.u_year;
    var rdate = newQuoteobj.u_date;
    var ryear = rdate.substring(0,4);
    //calculation for premium & IDV value

    sendMail(process.env.MailRUser, newQuoteobj);
    res.send({
      speech: "",
      displayText: "",
      actionIncomplete: false,
      followupEvent: {
        name: "gen-final-response1"
      }
    });

    //delete newQuoteobj;

  } else if (intentFrom === 'GetQuote-step6-fallback') {
    msg = {
      "speech": "",
      "displayText": "",
      "messages": [{
        "type": 4,
        "platform": "facebook",
        "payload": {
          "facebook": {
            "text": `Have you bought your vehicle on loan?`,
            "quick_replies": [{
              "content_type": "text",
              "title": "Yes",
              "payload": "Yes"
            },
            {
              "content_type": "text",
              "title": "No",
              "payload": "No"
            },
            {
              "content_type": "text",
              "title": "Help",
              "payload": "liveperson"
            }
            ]
          }
        }
      }]
    };
    res.json(msg);
  } else if (intentFrom === 'liveperson') {

    msg = {
      "speech": "",
      "displayText": "",
      "messages": [{
        "type": 4,
        "platform": "facebook",
        "payload": {
          "facebook": {
            "text": `Okay, I see you need help from a liveperson. Are you sure?`,
            "quick_replies": [{
              "content_type": "text",
              "title": "Yes",
              "payload": "Yes"
            },
            {
              "content_type": "text",
              "title": "No",
              "payload": "No"
            }
            ]
          }
        }
      }]
    };
    res.json(msg);
  // } else if (intentFrom == "TweetFeedDetails") {
  //   console.log('```````Session ID`````````', req.body.sessionId);
  //   commonFiles.writeIncompleteTran(req.body.sessionId, true, "Roaming", function (err, data) {
  //     if (err) {
  //       res.send({
  //         speech: "Error in API response!!!",
  //         displayText: ""
  //       });
  //     }
  //     console.log(data);
  //     if (data == true) {
  //       res.send({
  //         speech: "",
  //         displayText: "",
  //         followupEvent: {
  //           name: "feedbackEvent"
  //         }
  //       });
  //     } else {
  //       msg = {
  //         "speech": "",
  //         "displayText": "",
  //         "messages": [{
  //           "type": 1,
  //           "platform": "facebook",
  //           "title": "HOME BROADBAND",
  //           "subtitle": "If you're running multiple devices, part of a big family or streaming on-demand video, then Broadband & nbn™ is just the ticket for your entertainment needs!<br/><br/><br/><br/>",
  //           "imageUrl": "https://smb.optus.com.au/opfiles/Shop/Consumer/Assets/Images/Broadband/broadband-NBN-landing-page-3UP.png",
  //           "buttons": [{
  //             "text": "Show More",
  //             "postback": "https://www.optus.com.au/shop/broadband/home-broadband"
  //           },
  //           {
  //             "text": "Select this plan",
  //             "postback": "HOME BROADBAND"
  //           }
  //           ]
  //         },
  //         {
  //           "type": 1,
  //           "platform": "facebook",
  //           "title": "HOME WIRELESS BROADBAND",
  //           "subtitle": "Get connected to Australia’s Winning Mobile Network. Enjoy instant plug and play wireless broadband in your home with unlimited data options on a flexible wireless broadband plans.",
  //           "imageUrl": "https://smb.optus.com.au/opfiles/Shop/Consumer/Broadband/Media/Images/HV-18-HWBB-3UP.jpg",
  //           "buttons": [{
  //             "text": "Show More",
  //             "postback": "https://www.optus.com.au/shop/broadband/home-wireless-broadband"
  //           },
  //           {
  //             "text": "Select this plan",
  //             "postback": "HOME WIRELESS BROADBAND"
  //           }
  //           ]
  //         },
  //         {
  //           "type": 1,
  //           "platform": "facebook",
  //           "title": "MOBILE BROADBAND",
  //           "subtitle": "If you're on the road, study remotely or need to keep the kids entertained in the car, you can stay connected on the move with Mobile Broadband.<br/><br/><br/><br/>",
  //           "imageUrl": "https://smb.optus.com.au/opfiles/Shop/Consumer/Broadband/Media/Images/tile-mobile-broadband.jpg",
  //           "buttons": [{
  //             "text": "Show More",
  //             "postback": "https://www.optus.com.au/shop/broadband/mobile-broadband"
  //           },
  //           {
  //             "text": "Select this plan",
  //             "postback": "MOBILE BROADBAND"
  //           }
  //           ]
  //         }
  //         ]
  //       };
  //     }
  //     return res.json(msg);
  //   });
  } else if (intentFrom == "HomeInsurance-yes") {
    console.log("testerter");
    msg = {
      "speech": "",
      "displayText": "",
      "messages": [{
        "type": 1,
        "platform": "facebook",
        "title": "Agreed Value Basis",
        "subtitle": "PLATINUM PLAN",
        "Url":"#",
        "imageUrl": "http://www.netshellinfosystem.com/wp-content/uploads/2016/06/plat2.png",
        "buttons": [{
          "text": "Select",
          "postback": "PLATINUM PLAN"
        }
        ]
      },
      {
        "type": 1,
        "platform": "facebook",
        "title": "Reinstatement Value Basis",
        "subtitle": "DIAMOND PLAN",
        "Url":"#",
        "imageUrl": "http://gslaundry.com.ng/wp-content/uploads/2018/03/diamond_opt.png",
        "buttons": [{
          "text": "Select",
          "postback": "DIAMOND PLAN"
        }
        ]
      },
      {
        "type": 1,
        "platform": "facebook",
        "title": "Indemnity Basis",
        "subtitle": "GOLD PLAN",
        "Url":"#",
        "imageUrl": "https://i1.wp.com/www.bigbazarsale.com/wp-content/uploads/2018/03/gold-package.png",
        "buttons": [{
          "text": "Select",
          "postback": "GOLD PLAN"
        }
        ]
      }
      ]
    };

    return res.json(msg);

  } else if (intentFrom == "AnotherQueryIntent") {
    // let query = req.body.result.resolvedQuery;
    console.log('Session ID: ', req.body.sessionId);
    commonFiles.getIncompleteTran(req.body.sessionId, function (err, data) {
      console.log('Incomplete Status', data);
      if (data == 'false') {
        msg = {
          "speech": "",
          "displayText": "",
          "messages": [{
            "type": 0,
            "platform": "facebook",
            "speech": "I can also help you with the following."
          },
          {
            "type": 1,
            "platform": "facebook",
            "title": "Opty",
            "subtitle": "Please choose from one of these options",
            "imageUrl": "http://www.campaigncentre.com.au/_client/_images/ROCKDALE0773/outlet/logo/sh45-optus_logo2.jpg",
            "buttons": [{
              "text": "Account Management",
              "postback": "Account Management"
            },
            {
              "text": "Billing related",
              "postback": "Billing related"
            },
            {
              "text": "Network Related",
              "postback": "Network Related"
            }
            ]
          }
          ]
        };
        return res.json(msg);
      } else {
        msg = {
          "speech": "",
          "displayText": "",
          "messages": [{
            "type": 4,
            "platform": "facebook",
            "payload": {
              "facebook": {
                "text": "Your last transaction was cancelled. Would you like to continue?",
                "quick_replies": [{
                  "content_type": "text",
                  "title": "Yes",
                  "payload": "Yes"
                },
                {
                  "content_type": "text",
                  "title": "No",
                  "payload": "No"
                }
                ]
              }
            }
          }],
          contextOut: [{
            "name": "IncompleteTran",
            "lifespan": 1,
            "parameters": {}
          }]
        };
        return res.json(msg);
      }
    });
  } else if (intentFrom == "COA-CompleteAddress-Update-No") {
    res.send({
      followupEvent: {
        name: "UpdateNewAddress",
        data: {
          "address": ""
        }
      }
    });
  } else if (intentFrom == "COA-ABP-Line1-Address" || intentFrom == "COA-ABP-Line2-Address" || intentFrom === 'COA-CompleteAddress-Update') {
    let paramaddress = req.body.result.parameters.address;
    console.log('Valid addr', req.body.result.parameters.address);
    addressify(req.body.result.parameters.address, intentFrom, line1, function (err, isValid) {
      if (err) {
        res.send({
          speech: "Error in API response of addressify!!!",
          displayText: ""
        });
      }

      if (isValid) {
        if (linestatus == 1) {
          let addressChange = `Thanks, that’s a valid address! Your new billing address is<br/>${paramaddress}<br/>${line2}<br/>${line3}<br/> Can you confirm this?`;

          msg = {
            "speech": "",
            "displayText": "",
            "messages": [{
              "type": 4,
              "platform": "facebook",
              "payload": {
                "facebook": {
                  "text": addressChange,
                  "quick_replies": [{
                    "content_type": "text",
                    "title": "Yes",
                    "payload": "Yes"
                  },
                  {
                    "content_type": "text",
                    "title": "No",
                    "payload": "No"
                  }
                  ]
                }
              }
            }]
          };
          linestatus = 0;
          return res.json(msg);
        }
        if (linestatus == 2) {
          // var addressList = isValid.addressArray;

          let addressChange = `Thanks, that’s a valid address! Your new billing address is<br/>${line1}<br/>${paramaddress}<br/>${line3}<br/> Can you confirm this?`;
          // var quickReplies = [];
          // addressList.forEach(element => {
          //   quickReplies.push({
          //     "content_type": "text",
          //     "title": element,
          //     "payload": element
          //   })
          // });

          msg = {
            "speech": "",
            "displayText": "",
            "messages": [{
              "type": 4,
              "platform": "facebook",
              "payload": {
                "facebook": {
                  "text": addressChange,
                  "quick_replies": [{
                    "content_type": "text",
                    "title": "Yes",
                    "payload": "Yes"
                  },
                  {
                    "content_type": "text",
                    "title": "No",
                    "payload": "No"
                  }
                  ]
                }
              }
            }]
          };
          linestatus = 0;
          return res.json(msg);
        } else {
          let addressChange = `Thanks, that’s a valid address! Your new billing address is<br/>${paramaddress}<br/> Can you confirm this?`;
          msg = {
            "speech": "",
            "displayText": "",
            "messages": [{
              "type": 4,
              "platform": "facebook",
              "payload": {
                "facebook": {
                  "text": addressChange,
                  "quick_replies": [{
                    "content_type": "text",
                    "title": "Yes",
                    "payload": "Yes"
                  },
                  {
                    "content_type": "text",
                    "title": "No",
                    "payload": "No"
                  }
                  ]
                }
              }
            }]
          };
          return res.json(msg);
        }
      } else {
        res.send({
          speech: "Looks like you have entered an invalid address. Please enter a valid one",
          displayText: ""
        });
      }
    });
  } else if (intentFrom == "COA-AddressByPart-Line1" || intentFrom == "COA-ABP-Line1-Address-No") {

    let addressChange = `Please enter the replacement for ${line1}`;
    res.send({
      speech: addressChange,
      displayText: ""
    });
    linestatus = 1;
  } else if (intentFrom == "COA-AddressByPart-Line2" || intentFrom == "COA-ABP-Line2-Address-No") {
    let addressChange = `Please enter the replacement for ${line2}`;
    res.send({
      speech: addressChange,
      displayText: ""
    });
    linestatus = 2;
  } else if (intentFrom == "COA-AddressByPart-Line3") {
    let addressChange = `Please enter the replacement for ${line3}`;
    res.send({
      speech: addressChange,
      displayText: ""
    });
    linestatus = 3;
  } else if (intentFrom == "COA-AddressByPart") {
    let line1 = "52, Scenic Road";
    let line2 = "SUMMER ISLAND, NSW 2440";
    // let line3 = "Australia 2627";
    msg = {
      "speech": "",
      "displayText": "",
      "messages": [{
        "type": 4,
        "platform": "facebook",
        "payload": {
          "facebook": {
            "text": `OK. Please choose the line you’d like to replace <br/><br/> 1. ${line1}<br/>2. ${line2}<br/>`,
            "quick_replies": [{
              "content_type": "text",
              "title": "Line 1",
              "payload": "Line 1"
            },
            {
              "content_type": "text",
              "title": "Line 2",
              "payload": "Line 2"
            }
            ]
          }
        }
      }]
    };
    return res.json(msg);

  } else if (intentFrom == "COA-ABP-Line1-Address-CommunicateYesNo" || intentFrom == "COA-ABP-Line2-Address-CommunicateYesNo" || intentFrom === "COA-CA-CommunicateYesNo") {

    let query = req.body.result.resolvedQuery;

    objData = new commonFiles.serviceNowEntityAddress();
    objData.u_string_3 = '9876543210';
    if (intentFrom === 'COA-ABP-Line2-Address-CommunicateYesNo') {
      objData.u_description = "Part of Address Change line 2. " + line2;
    } else {
      objData.u_description = "Part of Address Change line 1. " + line1;
    }
    objData.u_addresspri = query;
    type = 'SERVICEREQUEST';

    if (intentFrom === "COA-CA-CommunicateYesNo") {
      objData.u_description = "Complete Address Change";
    }

    commonFiles.callServiceNowApi(JSON.parse(JSON.stringify(objData)), type, function (error, data) {
      let SRID = data.result.u_number;

      let dateCreated = data.result.sys_created_on;
      var myDate = new Date(new Date(dateCreated).getTime() + (2 * 24 * 60 * 60 * 1000));
      myDate = myDate.getDate() + "/" + Number(myDate.getMonth() + 1) + "/" + myDate.getFullYear();
      let finalAddress = `Sure. Your billing & communication address will be updated on or before ${myDate}. The ticket# is ${SRID}. Is there anything else I may help you with?`;

      var msg = '';
      msg = {
        speech: '',
        messages: [{
          "type": 4,
          "platform": "facebook",
          "payload": {
            "facebook": {
              "text": finalAddress,
              "quick_replies": [{
                "content_type": "text",
                "title": "Yes",
                "payload": "another_query"
              },
              {
                "content_type": "text",
                "title": "No",
                "payload": "no_thanks"
              }
              ]
            }
          }
        }]
      };
      res.json(msg);
    });
  } else if (intentFrom == "TwitterFeed") {
    let twitterData = await callTwitterFeed();
    console.log|(JSON.stringify(twitterData))
    if (twitterData && twitterData[0] && twitterData[0].keyword == "health") {
      var msg = '';
      msg = {
        speech: '',
        messages: [{
          "type": 4,
          "platform": "facebook",
          "payload": {
            "facebook": {
              "text": "Will you be interested to take a look into our Health Insurance Plans?",
              "quick_replies": [{
                "content_type": "text",
                "title": "Yes",
                "payload": "Yes"
              },
              {
                "content_type": "text",
                "title": "No",
                "payload": "no_thanks"
              },
              {
                "content_type": "text",
                "title": "Help",
                "payload": "liveperson"
              }
              ]
            }
          }
        }]
      };
      res.json(msg);
    } else {
      console.log(1);
      res.send({
        speech: "",
        displayText: "",
        followupEvent: {
          name: "feedbackEvent"
        }
      });
    }
  } else if (intentFrom == 'AnythingElse') {
    console.log('Intent fired ---- Anything else');
    res.send({
      followupEvent: {
        name: "AnythingElse"
      }
    });
  } else if (intentFrom == 'AM-DOB') {
    var dob = req.body.result.parameters["date"];
    if (commonFiles.validateDOB(dob)) {
      var msg = '';
      msg = {
        "speech": "",
        "displayText": "",
        "messages": [{
          "type": 0,
          "platform": "facebook",
          "speech": "Thanks Ms.Charlotte!"
        },
        {
          "type": 1,
          "platform": "facebook",
          "title": "Opty",
          "subtitle": "Please choose an option below",
          "imageUrl": "http://www.campaigncentre.com.au/_client/_images/ROCKDALE0773/outlet/logo/sh45-optus_logo2.jpg",
          "buttons": [{
            "text": "Change of Address",
            "postback": "Change of Address"
          },
          {
            "text": "Update Alternate Contact#",
            "postback": "Update Alternate Contact#"
          },
          {
            "text": "Change Bill Plan",
            "postback": "Change Bill Plan"
          }
          ]
        }
        ]
      };
      res.json(msg);
    } else {
      res.send({
        speech: "Looks like your date of birth is invalid. Please provide a valid one.",
        displayText: "",
        contextOut: req.body.result.contexts
      });
    }
  } else if (intentFrom == 'Broadbandplans') {
    var broadbandPlans = req.body.result.parameters["broadband_plans"];
    objData = new commonFiles.serviceNowEntityBroadband();
    objData.u_string_3 = '9876543210';
    objData.u_description = "Customer has asked query regarding this " + broadbandPlans + " plan";
    type = 'SERVICEREQUEST';

    commonFiles.callServiceNowApi(JSON.parse(JSON.stringify(objData)), type, function (error, data) {
      let SRID = data.result.u_number;

      let dateCreated = data.result.sys_created_on;
      var myDate = new Date(new Date(dateCreated).getTime() + (2 * 24 * 60 * 60 * 1000));
      myDate = myDate.getDate() + "/" + Number(myDate.getMonth() + 1) + "/" + myDate.getFullYear();
      let finalAddress = `Sure. Your request has been taken, our customer executive will contact you in the next 1 hour to your primary contact number. The ticket# is ${SRID}. Is there anything else I may help you with?`;

      commonFiles.writeIncompleteTran(req.body.sessionId, false, "Roaming", function (err, data) {
        if (err) {
          res.send({
            speech: "Error in API response!!!",
            displayText: ""
          });
        }
        console.log(data);
      });

      var msg = '';
      msg = {
        speech: '',
        messages: [{
          "type": 4,
          "platform": "facebook",
          "payload": {
            "facebook": {
              "text": finalAddress,
              "quick_replies": [{
                "content_type": "text",
                "title": "Yes",
                "payload": "another_query"
              },
              {
                "content_type": "text",
                "title": "No",
                "payload": "no_thanks"
              }
              ]
            }
          }
        }]
      };
      res.json(msg);
    });

  } else if (intentFrom === 'AccountManagement' || intentFrom === 'AM-ContactNo-Reprompt') {
    readFileSession('sessionID.json').then(async function (file) {
      let data = JSON.parse(file);
      let obj = data.find(x => x.sessionID === req.body.sessionId);
      console.log('````````Session ID-----', req.body.sessionId);
      console.log("--------------Object Type-------------------");
      console.log(obj["type"]);
      if (obj["type"] == "false") {
        var mobileNo = req.body.result.parameters["mobileno"];
        var phoneStr = commonFiles.validatePhoneNo(mobileNo);
        if (phoneStr != 'valid') {
          res.send({
            followupEvent: {
              name: "UpdateAltContact",
              data: {
                "mobileno": "",
                "MSG": phoneStr
              }
            }
          });
        } else {
          var msg = '';
          msg = {
            speech: '',
            messages: [{
              "type": 4,
              "platform": "facebook",
              "payload": {
                "facebook": {
                  "text": "Before we proceed further, can I ask you a few questions for security reasons?",
                  "quick_replies": [{
                    "content_type": "text",
                    "title": "Yes",
                    "payload": "Yes"
                  },
                  {
                    "content_type": "text",
                    "title": "No",
                    "payload": "No"
                  }
                  ]
                }
              }
            }]
          };
          res.json(msg);
        }
      }
      else {
        var msg = '';
        msg = {
          "speech": "",
          "displayText": "",
          "messages": [{
            "type": 0,
            "platform": "facebook",
            "speech": "Thanks Ms.Charlotte!"
          },
          {
            "type": 1,
            "platform": "facebook",
            "title": "Opty",
            "subtitle": "Please choose an option below",
            "imageUrl": "http://www.campaigncentre.com.au/_client/_images/ROCKDALE0773/outlet/logo/sh45-optus_logo2.jpg",
            "buttons": [{
              "text": "Change of Address",
              "postback": "Change of Address"
            },
            {
              "text": "Update Alternate Contact#",
              "postback": "Update Alternate Contact#"
            },
            {
              "text": "Change Bill Plan",
              "postback": "Change Bill Plan"
            }
            ]
          }
          ]
        };
        res.json(msg);
      }
    });
  } else if (intentFrom == 'DirectUpdateAlternateContactNo-No') {
    res.send({
      followupEvent: {
        name: "UpdateAltContact",
        data: {
          "phone-number": "",
          "MSG": "That's fine, re-enter the phone number again..."
        }
      } //,
      //contextOut: req.body.result.contexts
    });
  } else if (intentFrom == 'DirectUpdateAlternateContactNo' || intentFrom == 'DirectUpdateAlternateContactNo-Reprompt') {
    console.log('RESULT', JSON.stringify(req.body));
    console.log('PHONE NO', req.body.result.parameters["phone-number"]);
    var phoneNo = req.body.result.parameters["phone-number"];
    var phoneStr = commonFiles.validatePhoneNo(phoneNo);
    if (phoneStr != 'valid') {
      res.send({
        followupEvent: {
          name: "UpdateAltContact",
          data: {
            "phone-number": "",
            "MSG": phoneStr
          }
        }
      });
    } else {
      var msg = '';
      msg = {
        speech: '',
        messages: [{
          "type": 4,
          "platform": "facebook",
          "payload": {
            "facebook": {
              "text": "Well, you want me to update your alternate contact# for 892 901 1007 as " + phoneNo + ". Is that correct?",
              "quick_replies": [{
                "content_type": "text",
                "title": "Yes", "payload": "Yes"
              },
              {
                "content_type": "text",
                "title": "No",
                "payload": "No"
              }
              ]
            }
          }
        }]
      };
      res.json(msg);
    }
  } else if (intentFrom == 'CheckInspectionStatus') {
    getDetails = new commonFiles.getDetails();
    var type = 'GETPLAN';
    commonFiles.getServiceNowIncidents(type, 'u_name=Mukil', function (error, data) {
      console.log('data', data);
      console.log('count', data.result.length);
      var msg = '';
      if (!data.result.length) {
        msg = {
          "speech": "",
          "displayText": "",
          "messages": [{
            "type": 0,
            "platform": "facebook",
            "speech": "Hey Mukil!!, looks like there is no pending service request is with us."
          }]
        };
        return res.json(msg);
      } else {
        console.log("else part");
        console.log(data.result[0]);
        var SRID = data.result[0].u_number;
        var status = data.result[0].u_status;

        if (status == "Inspection Completed") {
          console.log("else part -- CLOSED");
          var data = {
            'event': { 'name': 'CheckInspectionStatus_Event' },
            'timezone': 'America/New_York',
            'lang': 'en',
            'sessionId': sessionId
          };
          commonFiles.callDialogflowAPI(data).then((result) => {
            console.log("DF result", result);
            msg = {
              "speech": "",
              "displayText": "",
              "messages": [{
                "type": 0,
                "platform": "facebook",
                "speech": "Looks like the Service Request created with us has a status : 'Claim Finished'. Is there anything else you would like to know about, please start by saying 'hi'"
              }]
            };
            return res.json(msg);
          }).catch((err) => {
            console.log("df error", err);
          });

        } else if (status == "Inspection Inprogress") {
          console.log("else part -- IN PROGRESS");
          var data = {
            'event': { 'name': 'ClaimIntimationFollowup_Event' },
            'timezone': 'America/New_York',
            'lang': 'en',
            'sessionId': sessionId
          };
          commonFiles.callDialogflowAPI(data).then((result) => {
            console.log("DF result", result);
            msg = {
              "speech": "",
              "displayText": "",
              "messages": [{
                "type": 0,
                "platform": "facebook",
                "speech": commonFiles.WelcomeMsg() + " Mukil. Your request for inspection(SR #" + SRID + " ) is " + status + ". The inspection will be completed within the next 4 hrs. Is there anything else i can help you with?"
              }]
            };
            return res.json(msg);
          }).catch((err) => {
            console.log("df error", err);
          });
        } else if (status == "Claim Closed") {
          resp = "Please choose an option to start with";
          msg = {
            "speech": "",
            "messages": [{
              "type": 4,
              "platform": "facebook",
              "payload": {
                "facebook": {
                  "attachment": {
                    "type": "template",
                    "payload": {
                      "template_type": "generic",
                      "elements": [{
                        "title": "",
                        "image_url": "https://www.allianz.com/v_1465855200000/images/logos/Allianz-Logo.jpg",
                        "subtitle": resp,
                        "buttons": [ 
                        {
                          "postback": "Accident intimation",
                          "text": "Accident intimation"
                        },
                        {
                          "postback": "Enquire Plan Expiry",
                          "text": "Enquire Plan Expiry"
                        },
                        {
                          "postback": "Get quote",
                          "text": "Get quote"
                        }
                        // {
                        //   "postback": "Home insurance",
                        //   "text": "Home insurance"
                        // }
                        ]
                      }]
                    }
                  }
                }
              }
            }]
          };
          return res.json(msg);
        }
      }
    });

  } else if (intentFrom == "CheckInspectionStatus-no") {

    var msg = '';
    // var objDaDif = [];    
    // const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    
    // function dateDiffInDays(a, b) {
    //   const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    //   const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    //   return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    // }  
    // for (let i in profileDetails.details) {
    //   var a = new Date();
    //   var b = new Date(profileDetails.details[i].vehicle_date);
    //   var diff = dateDiffInDays(a,b);
    //   objDaDif.push(diff);
    // }
    //var indexOfMaxValue = objDaDif.reduce((iMax, x, i, arr) => x < arr[iMax] ? i : iMax, 0);
    // console.log("indexOfMaxValue -- ",indexOfMaxValue);    
    // console.log("Math.min -- ",Math.min.apply(null, objDaDif));
      
    let vehicleDate = new Date(profileDetails.details[indexOfMaxValue].vehicle_date);
    console.log('Cdate--',Cdate);
    console.log('vehicleDate--',vehicleDate);
    if(Cdate>vehicleDate)
      var msgPLus = ' Would you like to renew now?';
    else
      var msgPLus = ' You get a 5% discount for renewing it now. Are you interested?';
    msg = {
      "speech": "",
      "displayText": "",
      "messages": [{
        "type": 0,
        "platform": "facebook",
        "speech": "BTW, your vehicle insurance for the car TN 01 AB – 1234 is due for renewal by 22 Sep 2018."+msgPLus
      }]
    };
    return res.json(msg);
  } else if(intentFrom == "CheckInspectionStatus-no-enq") {
    // var objDaDif = [];    
    // const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    
    // function dateDiffInDays(a, b) {
    //   const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    //   const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    //   return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    // }  
    // for (let i in profileDetails.details) {
    //   var a = new Date();
    //   var b = new Date(profileDetails.details[i].vehicle_date);
    //   var diff = dateDiffInDays(a,b);
    //   objDaDif.push(diff);
    // }
    //var indexOfMaxValue = objDaDif.reduce((iMax, x, i, arr) => x < arr[iMax] ? i : iMax, 0);
    // console.log("indexOfMaxValue -- ",indexOfMaxValue);    
    // console.log("Math.min -- ",Math.min.apply(null, objDaDif));
      
    let vehicleDate = new Date(profileDetails.details[indexOfMaxValue].vehicle_date); 
    console.log('Cdate--',Cdate);
    console.log('vehicleDate--',vehicleDate);   
    if(Cdate>vehicleDate)
      var msgPLus = ' Would you like to renew now?';
    else
      var msgPLus = ' You get a 5% discount for renewing it now. Are you interested?';

    var firstVehicle = profileDetails.details[0].user_vehicle_make+' '+profileDetails.details[0].user_vehicle_model+' '+profileDetails.details[0].user_vehicle_type;
    var secondVehicle = profileDetails.details[1].user_vehicle_make+' '+profileDetails.details[1].user_vehicle_model+' '+profileDetails.details[1].user_vehicle_type;
    let message_con =  [{
          "type": 0,
          "platform": "facebook",
          "speech": "Here are the expiry dates: "
        },
        {
          "type": 0,
          "platform": "facebook",
          "speech": `1. `+profileDetails.details[0].user_vehicle+`, `+firstVehicle+` – <b>`+profileDetails.details[0].vehicle_date+`</b><br>2. `+profileDetails.details[1].user_vehicle+`, `+secondVehicle+` – <b>`+profileDetails.details[1].vehicle_date+`</b>`
        },
        {
          "type": 0,
          "platform": "facebook",
          "speech": "BTW, your vehicle insurance for the car "+profileDetails.details[indexOfMaxValue].user_vehicle+" is due for renewal by "+profileDetails.details[indexOfMaxValue].vehicle_date+"."+msgPLus
        }];
    var msg = '';
    msg = {
      "speech": "",
      "displayText": "",
      "messages": message_con
    };
    return res.json(msg);
  } else if (intentFrom == "CheckInspectionStatus-yes") {
    msg = {
      "speech": "",
      "displayText": "",
      "messages": [
        {
        "type": 1,
        "platform": "facebook",
        "title": "Base Plan",
        "subtitle": `<div style="font-size:12px">
        <div style="margin-top:4px">- Get a vehicle tracking and monitoring device under DriveSmart Service</div>
        <div style="margin-top:4px">- Cashless claim settlement at over 4000 preferred garages</div>
        <div style="margin-top:19px"><i>₹8000</i></div></div>`,
        "Url":"https://www.bajajallianz.com/Corp/motor-insurance/value-added-services.jsp",
        "imageUrl": "http://www.netshellinfosystem.com/wp-content/uploads/2016/06/plat2.png",
        "buttons": [{
          "text": "Select",
          "postback": "BASE PLAN"
        }]
      },
      {
        "type": 1,
        "platform": "facebook",
        "title": "Assure Economy",
        "subtitle": `<div style="font-size:12px"><div style="margin-top:2px">- Depreciation Shield</div>
        <div style="margin-top:4px">- Engine Protector</div>
        <div style="margin-top:4px"><i>₹10000</i></div>
        <br><br><br><br></div>`,
        "Url":"https://www.bajajallianz.com/Corp/motor-insurance/value-added-services.jsp",
        "imageUrl": "http://gslaundry.com.ng/wp-content/uploads/2018/03/diamond_opt.png",
        "buttons": [{
          "text": "Select",
          "postback": "Assure Economy"
        },
      ]
      },{
        "type": 1,
        "platform": "facebook",
        "title": "Assure Prime Plus",
        "subtitle": `<div style="font-size:12px">
        <div style="margin-top:4px">- Key Lock Replacement</div>
        <div style="margin-top:4px">- Personal Baggage</div>
        <div style="margin-top:4px"><i>₹12000</i></div>
        <br><br><br><br></div>`,
        "Url":"https://www.bajajallianz.com/Corp/motor-insurance/value-added-services.jsp",
        "imageUrl": "http://gslaundry.com.ng/wp-content/uploads/2018/03/diamond_opt.png",
        "buttons": [{
          "text": "Select",
          "postback": "Assure Prime Plus"
        }]
      },
      {
        "type": 1,
        "platform": "facebook",
        "title": "Assure Economy Plus",
        "subtitle": `<div style="font-size:12px">
        <div style="margin-top:2px">- Key Lock Replacement</div>
        <div style="margin-top:4px">- Personal Baggage</div>
        <div style="margin-top:4px"><i>₹10000</i></div>
        <br><br><br><br>
        </div>`,
        "Url":"https://www.bajajallianz.com/Corp/motor-insurance/value-added-services.jsp",
        "imageUrl": "http://gslaundry.com.ng/wp-content/uploads/2018/03/diamond_opt.png",
        "buttons": [{
          "text": "Select",
          "postback": "Assure Economy Plus"
        }]
      }]
    };
    // msg = {
    //   speech: '',
    //   messages: [{
    //     "type": 4,
    //     "platform": "facebook",
    //     "payload": {
    //       "facebook": {
    //         "text": "WE are providing the below Insurance Plans. Please choose one below",
    //         "quick_replies": [{
    //           "content_type": "text",
    //           "title": "Base Plan & Features – Rs. 8320",
    //           "payload": "base plan"
    //         },
    //         {
    //           "content_type": "text",
    //           "title": "Premium Plan (B2B cover, 24*7 road side assistance) – Rs. 10300",
    //           "payload": "premium plan"
    //         }
    //         ]
    //       }
    //     }
    //   }]
    // };
    res.json(msg);

  } else if (intentFrom == "pay") {
    let twitterData = await callTwitterFeed();
    var msg = '';
    if (twitterData && twitterData[0] && twitterData[0].keyword == "health") {      
      // msg = {
      //   speech: '',
      //   messages: [{
      //     "type": 0,
      //     "platform": "facebook",
      //     "speech": "Renewal of your auto insurance for TN-01-AB-1234, swift is successful."
      //   },
      //   {
      //     "type": 1,
      //     "platform": "facebook",
      //     "title": "Health Insurance",
      //     "subtitle": "Will you be interested to take a look into our Health Insurance Plans?",
      //     "imageUrl": "",
      //     "buttons": [{
      //       "text": "Yes",
      //       "postback": "Yes"
      //     },
      //     {
      //       "text": "No",
      //       "postback": "No"
      //     }
      //     ]
      //   }
      //   // {
      //   //   "type": 2,
      //   //   "platform": "facebook",
      //   //   "payload": {
      //   //     "facebook": {
      //   //       "text": "Will you be interested to take a look into our Health Insurance Plans?",
      //   //       "quick_replies": [{
      //   //         "content_type": "text",
      //   //         "title": "Yes",
      //   //         "payload": "Yes"
      //   //       },
      //   //       {
      //   //         "content_type": "text",
      //   //         "title": "No",
      //   //         "payload": "No"
      //   //       }
      //   //       ]
      //   //     }
      //   //   }
      //   // }
      // ]
      // };

      msg = {
        "messages":[{
          "type":0,
          "platform":"facebook",
          "speech":"Renewal of your auto insurance for TN-01-AB-1234, swift is successful."
        },
        {
          "type":4,
          "platform":"facebook",
          "payload":{
            "facebook":{
              "text":"Will you be interested to take a look into our Health Insurance Plans?",
              "quick_replies":[{
                "content_type":"text",
                "title":"Yes",
                "payload":"Yes"
              },{
                "content_type":"text",
                "title":"No",
                "payload":"No"
              }]
            }
          }
        }
      ]};
    } else {
      msg = {
        "speech": "",
        "displayText": "",
        "messages": [{
          "type": 0,
          "platform": "facebook",
          "speech": "Renewal of your auto insurance for TN-01-AB-1234, swift is successful. Is there anything else i can help you with?"
        }]
      };
    }
    return res.json(msg);
  } else if (intentFrom == "pay-yes") {
    msg = {
      "speech": "",
      "displayText": "",
      "messages": [{
        "type": 1,
        "platform": "facebook",
        "title": "Base Plan & Features – Rs. 10290",
        "subtitle": "BASE PLAN",
        "Url":"#",
        "imageUrl": "http://www.netshellinfosystem.com/wp-content/uploads/2016/06/plat2.png",
        "buttons": [{
          "text": "Select",
          "postback": "BASE PLAN"
        }
        ]
      },
      {
        "type": 1,
        "platform": "facebook",
        "title": "Premium Plan & Features – Rs. 17300",
        "subtitle": "PREMIUM PLAN",
        "Url":"#",
        "imageUrl": "http://gslaundry.com.ng/wp-content/uploads/2018/03/diamond_opt.png",
        "buttons": [{
          "text": "Select",
          "postback": "PREMIUM PLAN"
        }
        ]
      }
      ]
    };
    // msg = {
    //   speech: '',
    //   messages: [{
    //     "type": 4,
    //     "platform": "facebook",
    //     "payload": {
    //       "facebook": {
    //         "text": "WE are providing the below Insurance Plans. Please choose one below",
    //         "quick_replies": [{
    //           "content_type": "text",
    //           "title": "Base Plan & Features – Rs. 8320",
    //           "payload": "base plan"
    //         },
    //         {
    //           "content_type": "text",
    //           "title": "Premium Plan (B2B cover, 24*7 road side assistance) – Rs. 10300",
    //           "payload": "premium plan"
    //         }
    //         ]
    //       }
    //     }
    //   }]
    // };
    res.json(msg);
  } else if (intentFrom == "pay-yes-plan") {
    var msg = '';
    msg = {
      "speech": "",
      "displayText": "",
      "messages": [{
        "type": 0,
        "platform": "facebook",
        "speech": "Our representative will call you within 1 hour to complete your request. Your request # is SR:2332324. Is there anything else I can help you with?"
      }]
    };
    return res.json(msg);
  //} else if ((intentFrom === 'ClaimIntimationFollowup-no' || intentFrom === 'AccidentIntimation-yes-yes-final-no')) {
  } else if ((intentFrom === 'ClaimIntimationFollowup-no' || intentFrom === 'AccidentIntimation-yes-yes-final-no' || intentFrom === 'AccidentIntimation-yes-no-final-no' || intentFrom === 'No-Garage-Followup-no')) {
    res.send({
      speech: "",
      displayText: "",
      actionIncomplete: false,
      followupEvent: {
        name: "gen-final-response2"
      }
    });
  } else if(intentFrom === 'test'){
    msg = {
      "messages":[{
        "type":0,
        "platform":"facebook",
        "speech":"Hi Display text"
      },
      {
        "type":4,
        "platform":"facebook",
        "payload":{
          "facebook":{
            "text":"Please select any one",
            "quick_replies":[{
              "content_type":"text",
              "title":"B1",
              "payload":"B1"
            },
            {
              "content_type":"text",
              "title":"B2",
              "url":"https://westernpower.com.au/"
            },
            {
              "content_type":"text",
              "title":"B3",
              "tab":"https://google.com/"
            }]
          }
        }
      }
    ]};
    // msg = {
    //   speech: '',
      
    //   messages: [{
    //     "type": 0,
    //     "platform": "facebook",
    //     "speech": "Renewal of your auto insurance for TN-01-AB-1234, swift is successful."
    //   },
    //   {
    //     "type": 0,
    //     "platform": "facebook",
    //     "speech": "check 2"
    //   },
    //   // {
    //   //   "type": 2,
    //   //   "platform": "facebook",
    //   //   "title": "Health Insurance",
    //   //   "subtitle": "Will you be interested to take a look into our Health Insurance Plans?",
    //   //   "imageUrl": "",
    //   //   "buttons": [{
    //   //     "text": "Yes",
    //   //     "postback": "Yes"
    //   //   },
    //   //   {
    //   //     "text": "No",
    //   //     "postback": "No"
    //   //   }
    //   //   ]
    //   // }
    //   {
    //     "type": 2,
    //     "platform": "facebook",
    //     "payload": {
    //       "facebook": {
    //         "text": "Will you be interested to take a look into our Health Insurance Plans?",
    //         "quick_replies": [{
    //           "content_type": "text",
    //           "title": "Yes",
    //           "payload": "Yes"
    //         },
    //         {
    //           "content_type": "text",
    //           "title": "No",
    //           "payload": "No"
    //         }
    //         ]
    //       }
    //     }
    //   }
    // ]
    // };
    res.json(msg);
  } else {
    if (intentFrom === 'DUAC-Communicate-Yes' || intentFrom === 'DUAC-Communicate-No') {
      console.log('RESULT', JSON.stringify(req.body.result));

      // console.log('PHONENUM', JSON.stringify(req.body.result.contexts[1].parameters.phone-number));
      // console.log('PHONENUM', JSON.stringify(req.body.result.contexts[1].parameters.mobileno));
      objData = new commonFiles.serviceNowEntity();
      objData.u_string_3 = '9876543210';
      objData.u_description = 'Number change';
      type = 'SERVICEREQUEST';
      smsType = 'ADDRESSNUMSMSAPI';
      smsContent = 'alternate contact';
    } else if (intentFrom === 'BillUpdate-Confirm-SwitchPlan') {
      objData = new commonFiles.serviceNowEntity();
      objData.u_string_3 = 'Plan change for phone #892 901 1007 from $35 plan to $45 plan';
      objData.u_description = 'Plan change';
      type = 'UPDATEPLAN';
      smsType = 'PLANCHANGESMSAPI';
      // smsContent = 'address';
    }
    // else if (intentFrom === 'COA-ABP-Line1-Address-CommunicateYes') {
    //   objData = new commonFiles.serviceNowEntity();
    //   objData.u_string_3 = 'Plan change for phone #892 901 1007 from $35 plan to $45 plan';
    //   objData.u_description = 'Plan change';
    //   type = 'UPDATEPLAN';
    //   smsType = 'PLANCHANGESMSAPI';
    //   // smsContent = 'address';
    // }
    commonFiles.callServiceNowApi(JSON.parse(JSON.stringify(objData)), type, function (error, data) {
      if (error) {
        console.log('RESPONSE ERROR', JSON.stringify(error));
      } else {
        console.log('SR DATA', data);
        console.log('SR ID : ' + data.result.u_number);
        var msg = '';
        let dateCreated = data.result.sys_created_on;
        var myDate = new Date(new Date(dateCreated).getTime() + (2 * 24 * 60 * 60 * 1000));
        myDate = myDate.getDate() + "/" + Number(myDate.getMonth() + 1) + "/" + myDate.getFullYear();
        if (intentFrom === 'BillUpdate-Confirm-SwitchPlan') {
          //// SMS Content commented as of now!!!!!!
          // setTimeout(() => {
          //   commonFiles.sendSMSApi(smsType, '', '', '', '', '', function (err, resp) {
          //     console.log('SMS STATUS', resp);
          //   });
          // }, 30000); // 30 secs

          msg = {
            speech: '',
            messages: [{
              "type": 4,
              "platform": "facebook",
              "payload": {
                "facebook": {
                  "text": "Sure. I’ve switched the plan. Your $45 plan will be activated within 3 hrs. The ticket# is " + data.result.u_number + ". You would also receive an SMS it is updated. Is there anything else I may help you with?",
                  "quick_replies": [{
                    "content_type": "text",
                    "title": "Yes",
                    "payload": "another_query"
                  },
                  {
                    "content_type": "text",
                    "title": "No thanks",
                    "payload": "no_thanks"
                  }
                  ]
                }
              }
            }]
          };
        } else {
          if (intentFrom === 'DUAC-Communicate-Yes') {
            msg = {
              speech: '',
              messages: [{
                "type": 4,
                "platform": "facebook",
                "payload": {
                  "facebook": {
                    "text": "Sure. Your alternate contact number will be updated on or before " + myDate + ". The ticket# is " + data.result.u_number + ". Is there anything else I may help you with?",
                    "quick_replies": [{
                      "content_type": "text",
                      "title": "Yes",
                      "payload": "another_query"
                    },
                    {
                      "content_type": "text",
                      "title": "No thanks",
                      "payload": "no_thanks"
                    }
                    ]
                  }
                }
              }]
            };
          } else {
            msg = {
              speech: '',
              messages: [{
                "type": 4,
                "platform": "facebook",
                "payload": {
                  "facebook": {
                    "text": "Your alternate contact number and alternate communication channel will be updated on or before " + myDate + ". The ticket# is " + data.result.u_number + ". Is there anything else I may help you with?",
                    "quick_replies": [{
                      "content_type": "text",
                      "title": "Yes",
                      "payload": "another_query"
                    },
                    {
                      "content_type": "text",
                      "title": "No thanks",
                      "payload": "no_thanks"
                    }
                    ]
                  }
                }
              }]
            };
          }
          //// SMS Content commented as of now!!!!!!
          // commonFiles.sendSMSApi(smsType, '', '', smsContent, myDate, data.result.u_number, function (err, resp) {
          //   console.log('SMS STATUS', resp);
          // });
        }

        console.log('BUILT MSG', msg);
        return res.json(msg);
      }
    });
  }
});
//POST Call Endpoint

app.get("/test", async function (req, res) {
  var type = 'GETPLAN';
  commonFiles.getServiceNowIncidents(type, 'u_name=Mukil', function (error, data) {
    console.log('data', data);
    var SRID = data.result[0].u_number;
    var status = data.result[0].u_status;
    var msg = '';
    msg = {
      "speech": "",
      "displayText": "",
      "messages": [{
        "type": 0,
        "platform": "facebook",
        "speech": "Good Morning Mukil! Your request for inspection(" + SRID + ")is " + status + ". The inspection will be completed within the next 4 hrs. Is there anything else i can help you with?"
      }]
    };
    return res.json(msg);
  });
});
var sendMail = function (mailAddress, data) {
  let mailSubject = '', messageContent = '';
  console.log('Sending Mail...');
  console.log('---------data-------',JSON.stringify(data));
  var transporter = nodemailer.createTransport({
    service: 'Hotmail',
    auth: {
      user: process.env.MailUser,
      pass: process.env.MailPassword
    },
    tls: {
      rejectUnauthorized: false
    }
  });


  mailSubject = 'Quotation for vehicle Insurance';
  messageContent = `<!doctype html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width">
              <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
              <title>Vehicle Insurance Quotation</title>
              <style>
              /* -------------------------------------
                  INLINED WITH htmlemail.io/inline
              ------------------------------------- */
              /* -------------------------------------
                  RESPONSIVE AND MOBILE FRIENDLY STYLES
              ------------------------------------- */
              @media only screen and (max-width: 620px) {
                table[class=body] h1 {
                  font-size: 28px !important;
                  margin-bottom: 10px !important;
                }
                table[class=body] p,
                      table[class=body] ul,
                      table[class=body] ol,
                      table[class=body] td,
                      table[class=body] span,
                      table[class=body] a {
                  font-size: 16px !important;
                }
                table[class=body] .wrapper,
                      table[class=body] .article {
                  padding: 10px !important;
                }
                table[class=body] .content {
                  padding: 0 !important;
                }
                table[class=body] .container {
                  padding: 0 !important;
                  width: 100% !important;
                }
                table[class=body] .main {
                  border-left-width: 0 !important;
                  border-radius: 0 !important;
                  border-right-width: 0 !important;
                }
                table[class=body] .btn table {
                  width: 100% !important;
                }
                table[class=body] .btn a {
                  width: 100% !important;
                }
                table[class=body] .img-responsive {
                  height: auto !important;
                  max-width: 100% !important;
                  width: auto !important;
                }
              }
              /* -------------------------------------
                  PRESERVE THESE STYLES IN THE HEAD
              ------------------------------------- */
              @media all {
                .ExternalClass {
                  width: 100%;
                }
                .ExternalClass,
                      .ExternalClass p,
                      .ExternalClass span,
                      .ExternalClass font,
                      .ExternalClass td,
                      .ExternalClass div {
                  line-height: 100%;
                }
                .apple-link a {
                  color: inherit !important;
                  font-family: inherit !important;
                  font-size: inherit !important;
                  font-weight: inherit !important;
                  line-height: inherit !important;
                  text-decoration: none !important;
                }
                .btn-primary table td:hover {
                  background-color: #34495e !important;
                }
                .btn-primary a:hover {
                  background-color: #34495e !important;
                  border-color: #34495e !important;
                }
              }
              </style>
            </head>
            <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
              <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
                <tr>
                  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                  <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
                    <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
          
                      <!-- START CENTERED WHITE CONTAINER -->
                      <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">This is preheader text. Some clients will show this text as a preview.</span>
                      <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">
          
                        <!-- START MAIN CONTENT AREA -->
                        <tr>
                          <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                            <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                              <tr>
                                <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                                  <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello Mr.Mukil,</p>
                                  <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Thanks for your interest in our Auto Insurance. Here is a quote you had asked for:</p>
                                  <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>Your Vehicle Details</b></p>
                      <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Registration Number : ${data.u_reg}</p>
                      <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Make : ${data.u_make}</p>
                      <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Model : ${data.u_model}</p>
                      <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Variant : ${data.u_variant}</p>
                      <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Manufacturer Year : ${data.u_year}</p>
                      <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Registration Date : ${data.u_date}</p>
                                  <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
                                    <tbody>
                                      <tr>
                                        <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
                                          <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                            <tbody>
                                              <tr>
                                                <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; text-align: center;"> <div style="display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #3498db;">Comprehensive Premium </div></td>
                            </tr>
                            <tr>
                              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; text-align: center;"> <div style="display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #3498db;">IDV is: Rs.101254 </div></td>
                                              </tr>
                            <tr>
                              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; text-align: center;"> <div style="display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #3498db;">Premium : Rs.11254 </div></td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;"><b>Disclaimer</b>: We take privacy seriously. Allianz does not share your personal information with any third party. Please read our Privacy Policy here. Notwithstanding your registration as NDNC, fully/partially blocked and or your customer preference registration, by filling this form confirms that you agree to receive a sales or service call from our employees/telecallers based on information you have submitted here.s.</p>
                                  <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Regards</p>
                      <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Allianz Team</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
          
                      <!-- END MAIN CONTENT AREA -->
                      </table>
          
                      <!-- START FOOTER -->
                      <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
                        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                          <tr>
                            <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                              Powered by <a href="https://cryptic-fortress-41232.herokuapp.com/chatwindow" style="color: #999999; font-size: 12px; text-align: center; text-decoration: none;">Allianz</a>.
                            </td>
                          </tr>
                        </table>
                      </div>
                      <!-- END FOOTER -->
          
                    <!-- END CENTERED WHITE CONTAINER -->
                    </div>
                  </td>
                  <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                </tr>
              </table>
            </body>
          </html>`

  transporter.sendMail({
    from: process.env.MailUser,
    to: mailAddress,
    subject: mailSubject,
    html: messageContent
  });

};
console.log("Server Running at Port : " + port);
app.post("/profileDetails/:polno", function (req, res) {
  var commonPol;
  
  
    //commonPol
    if(!req.body) {
      res.status(200).json({"result":"No data is provided"});
    }
    if(!profileDetails){
      var profileDetails = new commonFiles.profileDetails()
    }
    for (let i in profileDetails.details) {
      if(profileDetails.details[i].user_vehicle_policy_no == req.param('polno'))
      {
        commonPol = i;
        profileDetails.details[i] = req.body;
        res.status(200).json({"result":"Your data related to "+req.param('polno')+" is updated successfully"});
      }
    }
    if(!commonPol) {
      res.status(200).json({"result":"No Policy Number is matching"});
    }
});
app.listen(port);


