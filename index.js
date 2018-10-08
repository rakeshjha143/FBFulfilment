//const Twitter = require('twitter');
const Sentiment = require('sentiment');
var express = require('express');
var session = require('express-session')
//onst MongoStore = require('connect-mongo')(session);
//const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var requestAPI = require('request');
const image2base64 = require('image-to-base64');
const roundTo = require('round-to');
//const uuidv1 = require('uuid/v1');
//const nodemailer = require('nodemailer');
//let fs = require('fs');
//var async = require('async');
var commonFiles = require('./util/commonfiles');
var addressify = require('./util/addressify').checkAddressify;


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

//Configuring express app behaviour
app.get("/policy", async function (req, res) {
  var profile = new commonFiles.profile();
  console.log(profile);
  res.json(profile);
  
});



const readFileSession = filePath => new Promise((resolve, reject) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

//GET Endpoint
var getDetails;
var newQuoteobj = '';
newQuoteobj = new commonFiles.newQuote();
getDetails = new commonFiles.getDetails();
var profileDetails = new commonFiles.profileDetails()
var latestSN = new commonFiles.latestSN();
var QueryType; 
var QueryTypeRisk; 
var RiskClass
var claimno;
var lossDate;
var lossType;
var lossCause;
var description;
var price;
var height;
var width;
var thickness;
var glassType;
var windowType;
var gSize; 
var h; 
var w; 
var t; 

function checkItem(query,message){
  message.messages[0].payload.facebook.quick_replies.forEach((item) => {
      if(item.title==query){
          item.selected = true;
      } else {
          delete item.selected;
      }
  });
  console.log("Before send");
  return message;
}

async function priceConverter(req,res){
  console.log("glassType: "+glassType+"windowType: "+windowType)
  console.log("h: "+h+"w: "+w+"t: "+t)
  var options = { method: 'POST',
  url: 'http://35.154.116.87:7999/aa/getMockGlassCost',
  headers: 
   { 'postman-token': '225193bc-ade0-bb34-6a7e-b6e8851b7c3b',
     'cache-control': 'no-cache',
     'content-type': 'application/json' },
  body: 
   { height: h,
     width: w,
     thickness: t,
     glassType: glassType,
     windowType: windowType},
  json: true };
return new Promise((resolve, reject) => {
requestAPI(options, function (error, response, body) {
  if (!error && response.statusCode === 200) {
    
    var validprice= body;
    price=roundTo(validprice.glassCost, 0);
    console.log(price); 
     return resolve(price);
     } else {
     return reject(error);
    }    
  
 
});
  }
)

  
}
async function CreateClaim(req,res)
{
 console.log('inside create claim------------');
  var options = { method: 'POST',
     
  url: 'http://35.154.116.87:8080/cc/service/edge/fnol/cfnol',

  headers:

   { 'postman-token': 'ff149a5b-daaf-0000-0b8c-5301c162be75',

     'cache-control': 'no-cache',

     authorization: 'Basic c3U6Z3c=',

     accept: 'application/json',

     'content-type': 'application/json' },

  body:

   { jsonrpc: '2.0',

     method: 'createClaimForHomeOwners',

     params:

     [ { lossDate: lossDate+'T00:00:00Z',
     
               lossType: 'PR',
     
               lossCause: 'glassbreakage',
     
               description: 'windowcrashed' } ] },

  json: true };

 
return new Promise((resolve, reject) => {
  console.log("Inside promise") ;
  //return resolve("000-00-000255");
 
requestAPI(options, function (error, response, body) {
  console.log('2------------',body);
 

  if (!error && response.statusCode === 200) {
   
    claimno = body.result;
      console.log(claimno); 
    return resolve(claimno);
    } else {
    return reject(error);
   }    
      
});
});
}
app.post("/fulfillment", async function (req, res) {

  // Service now status
  console.log("Rakesh jha");
  console.log("req", req);
  console.log("body", JSON.stringify(req.body));
  console.log(JSON.stringify(req.body.result.action));
  var sessionId = req.body.sessionId;
  console.log("sessionId", sessionId);
  console.log('Inside Policy API');
  let intentFrom = req.body.result.action;
  let intentQuery = req.body.result.resolvedQuery;
  let intentParam = req.body.result.parameters;
  var objData = null;
  var type = null;
  var smsType = null;
  var smsContent = '';
  var resp = commonFiles.WelcomeMsg();
  var msg = '';
 
  
  if (intentFrom === 'input.welcome' ) {
    msg = {
      "speech": "",
      "displayText": "",
      "messages":[
      {
        "type":4,
        "platform":"facebook",
        "payload":{
          "facebook":{
            "text":"What do you need assitance with?",
            "quick_replies":[{
              "content_type":"text",
              "title":"Claims",
              "payload":"Claims"
           
            },
            {
              "content_type":"text",
              "title":"Policy Change",
              "payload":"Policy Change"
               },
               {
                "content_type":"text",
                "title":"Renewal",
                "payload":"Renewal"
                 },{
                  "content_type":"text",
                  "title":"Quote",
                  "payload":"Quote"
                   }
          ]
          }
        }
      }
    ]};
    return res.json(msg);
  }
  else if (intentFrom === 'input.Underwriting' ) {
    msg ={
      // "messages": [
      //   {
      //     "type": 0,
      //     "platform": "facebook",
      //     "speech": "Hello, I'm Macy!<br><br>How can I help you today?<br><br>Enter your question below and I'll help you find the information you need."
      //      }]
      "speech": "",
      "displayText": "",
      "messages": [{
        "type": 0,
        "platform": "facebook",
        "speech": "Hi There, I'm Macy,!<br><br>your friendly Quote Assistant. How can I help you today?"
      }]
          }
    return res.json(msg);
  }
  else if (intentFrom === 'input.Claim02' ) {
    msg = {
      "speech": "",
      "displayText": "",
      "messages":[
      {
        "type":4,
        "platform":"facebook",
        "payload":{
          "facebook":{
            "text":"What do you want to Claim for?",
            "quick_replies":[
              {
                "content_type":"text",
                "title":"Applicance Breakdown",
                "payload":"Applicance Breakdown"
              },
              {
              "content_type":"text",
              "title":"Glass Breakage",
              "payload":"Glass Breakage"
            },
            {
              "content_type":"text",
              "title":"Water Leakage",
              "payload":"Water Leakage"
            },
            {
              "content_type":"text",
              "title":"Theft",
              "payload":"Theft"
            }
          ]
          }
        }
      }
    ]};
    return res.json(msg);
  } else if(intentFrom === 'input.ChooseClaim') {
    msg = {
      "speech": "",
      "displayText": "",
      "messages":[/*{
        "type":0,
        "platform":"facebook",
        "speech":"Sorry about that. We'll help you get this claim sorted out in no time."
      },*/
      {
        "type":4,
        "platform":"facebook",
        "payload":{
          "facebook":{
            "text":"Is the Claim related to your Auto, Home or Businessowners policy?",
            "quick_replies_img":[{
              "content_type":"text",
              "title":"Auto",
              "payload":"Auto"
            },{
              "content_type":"text",
              "title":"Home",
              "payload":"Home"
            },{
              "content_type":"text",
              "title":"Business",
              "payload":"BusinessOwners"
            }]
          }
        }
      }
    ]};
    return res.json(msg);
    //,
    //"image_url":"avatar/image/Auto.svg"
  } else if(intentFrom === 'input.policy') {
    msg = {
      "messages": [
        {
        "type": 0,
        "platform": "facebook",
        "speech": "Happy to inform that your broken window is covered under your Homeowners policy"
        },
          {
            "type": 4,
            "platform": "facebook",
            "payload":{
            "facebook":{
            "text": "When did the incident occur? Select from below or enter in MM/DD/YYYY format",
            "quick_replies": [
              {
                            "content_type":"text",
                            "title":"Today",
                            "payload":"Today"
                            
                },{
                  "content_type":"text",
                  "title":"Yesterday",
                  "payload":"Yesterday"
                  
      }
              
              ]}}
      
    }]};
    return res.json(msg);
  }
 
  else if(intentFrom === 'input.date') {

    lossDate=intentParam.date;
    console.log(lossDate);
    msg = {
      "speech": "",
      "displayText": "",
      "messages": [{
        "type": 0,
        "platform": "facebook",
        "speech": "Please upload the picture of the damaged glass?"
      }]
      
    };
    return res.json(msg);
  }

  else if(intentFrom === 'upload_image') {
   
    windowType=intentParam.WindowType;
    console.log("#####"+windowType);
    glassType=intentParam.ClaimGlassType;
    console.log(glassType);    
        
    msg = {
      "speech": "",
    "displayText": "",
    "messages": [{
        "type": 4,
        "platform": "facebook",
        "payload":{
        "facebook":{
          "text": "Can you validate the type of window? You can select another one if the suggested window type is not correct",
          "quick_replies": [
            {
                          "content_type":"text",
                          "title":"Single Hung Windows",
                          "payload":"Single Hung Windows",
                          "selected":true
              },
            {
                          "content_type":"text",
                          "title":"Double Hung Windows",
                          "payload":"Double Hung Windows"
                       
              },
            {
                          "content_type":"text",
                          "title":"Arched Windows",
                          "payload":"Arched Windows"
                       
              },
            {
                          "content_type":"text",
                          "title":"Bay Windows",
                          "payload":"Bay Windows",
                       
              },
            {
                          "content_type":"text",
                          "title":"Bow Windows",
                          "payload":"Bow Windows",
                       
              },
            {
                          "content_type":"text",
                          "title":"Casement Windows",
                          "payload":"Casement Windows",
                       
              },{
                          "content_type":"text",
                          "title":"Egress Windows",
                          "payload":"Egress Windows",
                       
              },{
                          "content_type":"text",
                          "title":"Garden Windows",
                          "payload":"Garden Windows",
                       
              },{
                          "content_type":"text",
                          "title":"Glass Block Windows",
                          "payload":"Glass Block Windows",
                       
              },{
                          "content_type":"text",
                          "title":"Hopper Windows",
                          "payload":"Hopper Windows",
                       
              },
            {
                          "content_type":"text",
                          "title":"Jalousie Windows",
                          "payload":"Jalousie Windows",
                       
              },
            {
                          "content_type":"text",
                          "title":"Picture Windows",
                          "payload":"Picture Windows",
                       
              },
            {
                          "content_type":"text",
                          "title":"Round Circle Windows",
                          "payload":"Round Circle Windows",
                       
              },
            {
                          "content_type":"text",
                          "title":"Skylight Windows",
                          "payload":"Skylight Windows",
                       
              },
            {
                          "content_type":"text",
                          "title":"Sliding Windows",
                          "payload":"Sliding Windows",
                       
              },
            {
                          "content_type":"text",
                          "title":"Storm Windows",
                          "payload":"Storm Windows",
                       
              },
            {
                          "content_type":"text",
                          "title":"Transom Windows",
                          "payload":"Transom Windows",
                       
              }
                       
                      ]
            
            
        }}}
      ]
  
      };
      //msg=await checkItem(windowType,msg);
      console.log("Before check Item");
    return res.json(msg);
  }
 
  
  else if(intentFrom === 'input.windows') {
    console.log(intentParam);
    windowType=intentParam.Windows;
    console.log(windowType);
    
    msg = {
      "speech": "",
    "displayText": "",
    "messages": [
           {
        "type": 4,
        "platform": "facebook",
        "payload":{
        "facebook":{
        "text": "Can you validate the type of glass? You can select another one if the suggested glass type is not correct",  
        "quick_replies": [
          {
                        "content_type":"text",
                        "title":"Float Glass",
                        "payload":"Float Glass",
                        "selected":true
            },
          {
                        "content_type":"text",
                        "title":"Safety Laminated Glass",
                        "payload":"Safety Laminated Glass"
                     
            },
          {
                        "content_type":"text",
                        "title":"Obscured Glass",
                        "payload":"Obscured Glass"
                     
            },
          {
                        "content_type":"text",
                        "title":"Annealed Glass",
                        "payload":"Annealed Glass",
                     
            },
          {
                        "content_type":"text",
                        "title":"Tinted Glass",
                        "payload":"Tinted Glass",
                     
            },
          {
                        "content_type":"text",
                        "title":"Tempered Glass",
                        "payload":"Tempered Glass",
                     
            },{
                        "content_type":"text",
                        "title":"Insulated Glass",
                        "payload":"Insulated Glass",
                     
            },{
                        "content_type":"text",
                        "title":"Mirrored Glass",
                        "payload":"Mirrored Glass",
                     
            },{
                        "content_type":"text",
                        "title":"Low-E Glass",
                        "payload":"Low-E Glass",
                     
            },{
                        "content_type":"text",
                        "title":"Wired Glass",
                        "payload":"Wired Glass",
                     
            },
          {
                        "content_type":"text",
                        "title":"Heat Strengthened Glass",
                        "payload":"Heat Strengthened Glass",
                     
            }]
      }}}
    ]

    }
    //msg=await checkItem(glassType,msg);
    console.log("Before check Item");
    return res.json(checkItem(glassType,msg));
  }
  else if(intentFrom === 'input.sizeOfglass') {
    glassType=intentParam.GlassType;
    console.log(glassType); 
    // msg = {
    //   "speech": "",
    //   "displayText": "",
    //   "messages": [{
    //     "type": 0,
    //     "platform": "facebook",
    //     "speech": "Input the correct size of the glass; eg- Height (in cm) x Width (in cm) x Thickness (in mm)"
    //   }]
      
    // };
    msg = {
      "speech": "",
    "displayText": "",
      "messages": [
        
          {
            "type": 4,
            "platform": "facebook",
            "payload":{
            "facebook":{
            "text": "Select the correct size of the glass or enter as Height (inch) x Width (inch) x Thickness (mm)",
            "quick_replies": [
              {
                "content_type":"text",
                "title":"24*24*6",
                "payload":"24*24*6"
    },
  {
                "content_type":"text",
                "title":"36*36*6",
                "payload":"36*36*6"
             
    },
  {
                "content_type":"text",
                "title":"24*36*4",
                "payload":"24*36*4"
             
    },
  {
                "content_type":"text",
                "title":"48*48*6",
                "payload":"48*48*6",
             
    },
    {
                "content_type":"text",
                "title":"36*48*6",
                "payload":"36*48*6",
   
}
                         
                        ]
              
              
          }}}
        ]
    
        };
        //msg=await checkItem(windowType,msg);
    //    console.log("Before check Item");
    return res.json(msg);
  }
  

  else if(intentFrom === 'input.GlassSize') {
    gSize=intentParam.GlassSize;
    h =intentParam.number1;
    w =intentParam.number2;
    t =intentParam.number3;
    console.log(gSize);
         
    await CreateClaim(req,res).then(async (claimno) => {
      
            if(claimno){
             console.log("Claim Number"+claimno);
              await priceConverter(req,res).then((price) => {
                console.log("Claim Number"+price);
                          msg={
                            "speech": "",
                            "displayText": "",
                             "messages": [{
                              "type": 0,
                              "platform": "facebook",
                              "speech": "Your Claim number is CL  "+claimno
                            },{
                              "type": 0,
                              "platform": "facebook",
                              "speech": "Based on the quotes received from the market, you are entitled to a claims payment of $"+price+
                              ". We've added an additional 10% to the market rates to cover any additional expenses that you may incur. "
                            },{
                              "type": 4,
                              "platform": "facebook",
                              "payload":{
                              "facebook":{
                              "text": "Do you want to know of  other repair options?",
                              "quick_replies": [
                                {
                                              "content_type":"text",
                                              "title":"Yes",
                                              "payload":"Yes"
                                              
                                  },{
                                    "content_type":"text",
                                    "title":"No",
                                    "payload":"No"
                                    
                        }
                                
                                ]}}
                        
                      }
                          ]
                            
                          };
                          return res.json(msg);
                        });
                      
                        
        }});
   
  //if(price!=null){
   
  
    
  }
  else if(intentFrom === 'otherOption') {
    msg={
    "speech": "",
    "displayText": "",
    "messages": [{
    "type": 0,
    "platform": "facebook",
    "speech": "We can get the glazing repaired for you, which would take 2 weeks to complete <br><br>Alternatively, you can send us a quote from a glazier and we'll pay out the claim"
    },{
      "type": 4,
      "platform": "facebook",
      "payload":{
      "facebook":{
      "text": "Please select an option for us to proceed further",
      "quick_replies_img":[{
        "content_type":"text",
        "title":"Cash Payment",
        "payload":"Cash Payment"
      },{
        "content_type":"text",
        "title":"Repair",
        "payload":"Repair"
      },{
        "content_type":"text",
        "title":"Self Quotes",
        "payload":"Self Quotes"
      }]}}

}
  
  ]

    };
    return res.json(msg);
    } 
  else if(intentFrom === 'input.Cash_10') {
    msg = {
      "speech": "",
      "displayText": "",
      "messages": [{
      "type": 0,
      "platform": "facebook",
      "speech": "Excellent! We'll initiate the wire transfer of this amount into your bank account, <br><br>associated with our records, within 24 hours"
      }]};
    return res.json(msg);
  }
  else if(intentFrom === 'input.cancel') {
    msg={
   
    "messages": [{
      "type": 4,
      "platform": "facebook",
      "payload":{
      "facebook":{
      "text": "Here is a quick reply!",
      "quick_replies":[{
        "content_type":"text",
        "title":"Search",
        "payload":"<POSTBACK_PAYLOAD>",
        "image_url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgEvw56_-w2K-Ml7Zc1gF5yXCWK02eOffT5uw6DkQzzGo230Dq_g"
      }]}}

}
  
  ]

    };
    return res.json(msg);
    } 

    // Bot to Call ...
    else if(intentFrom === 'others'){
      msg={
        "speech": "",
        "displayText": "",
        "messages": [
          {
        "type": 0,
        "platform": "facebook",
        "speech": "Ah Sorry !!!"
        },
        {
          "type": 0,
          "platform": "facebook",
          "speech": "I am unable to help you on this. Click here to conect with a senior underwriter or you can call your Agency Manager <b>Mr. John</b> @ <b>732 313 4444</b>"
          }
             
      ]
    
        };
       return res.json(msg);
    }
    else if (intentFrom === 'input.discount' ) {
      msg = {
        "messages": [
          {
          "type": 0,
          "platform": "facebook",
          "speech": "I am so sorry to hear that. Don't worry, I will help you out"
          },
          {
            "type": 0,
            "platform": "facebook",
            "speech": "We usually offer discount based on the number of coverage sections selected"
            },
            {
              "type": 0,
              "platform": "facebook",
              "speech": "Click here to refer the discount chart for more details"
              },
            {
              "type": 4,
              "platform": "facebook",
              "payload":{
              "facebook":{
              "text": "Is there anything else I can help you with?",
              "quick_replies": [
                {
                              "content_type":"text",
                              "title":"Yes",
                              "payload":"Yes"
                              
                  },{
                    "content_type":"text",
                    "title":"No",
                    "payload":"No"
                    
        }
                
                ]}}
        
      }]};
      return res.json(msg);
    }


    else if (intentFrom === 'input.discount.discount-yes' ) {
      msg = {
        "messages": [
       
            {
              "type": 4,
              "platform": "facebook",
              "payload":{
              "facebook":{
              "text": "Can you confirm your query type",
              "quick_replies_img": [
                {
                              "content_type":"text",
                              "title":"Risk Class",
                              "payload":"Risk Class"
                              
                  },{
                    "content_type":"text",
                    "title":"Deductible",
                    "payload":"Deductible"
                    
        },
        {
          "content_type":"text",
          "title":"Discount",
          "payload":"Discount"
          
},
{
  "content_type":"text",
  "title":"Coverage",
  "payload":"Coverage"
  
},
{
  "content_type":"text",
  "title":"Others",
  "payload":"Others"
  
}
                
                ]}}
        
      }]};
      return res.json(msg);
    }
    else if (intentFrom === 'higherDeductible' ) {
      msg = {
        "messages": [
          {
          "type": 0,
          "platform": "facebook",
          "speech": "Alright! First save your quote with standard deductible of 100 $. You can then chose the option <br><br>of voluntary deductible and select the deductible amount from the options in the list and then <br><br>generate premium"
          },
          {
            "type": 0,
            "platform": "facebook",
            "speech": "Higher the deductible amount selected, lower will be the premium amount"
            },
             {
              "type": 4,
              "platform": "facebook",
              "payload":{
              "facebook":{
              "text": "Is there anything else I can help you with?",
              "quick_replies": [
                {
                              "content_type":"text",
                              "title":"Yes",
                              "payload":"Yes"
                              
                  },{
                    "content_type":"text",
                    "title":"No",
                    "payload":"No"
                    
        }
                
                ]}}
        
      }]};
      return res.json(msg);
    }
    else if (intentFrom === 'higherDeductible.higherDeductible-yes' ) {
      msg={
        "speech": "",
        "displayText": "",
        "messages": [{
          "type": 4,
          "platform": "facebook",
          "payload":{
          "facebook":{
          "text": "Can you confirm your query type",
          "quick_replies_img":[{
            "content_type":"text",
            "title":"Risk Class",
            "payload":"Risk Class"
          },{
            "content_type":"text",
            "title":"Deductible",
            "payload":"Deductible"
          },{
            "content_type":"text",
            "title":"Discount",
            "payload":"Discount"
          },{
            "content_type":"text",
            "title":"Coverage",
            "payload":"Coverage"
          },{
            "content_type":"text",
            "title":"Others",
            "payload":"Others"
          }
        ]}}
    
    }
      
      ]
    
        };
      return res.json(msg);
    }

    else if(intentFrom === 'higherDeductible.higherDeductible-yes.higherDeductible-yes-custom'){
      QueryType=intentParam.queryType;
      console.log(QueryType);
      msg = { "messages": [
        {
        "type": 0,
        "platform": "facebook",
        "speech": "Excellent! Can you please specify your query on "+ QueryType
        }
       ]};
       return res.json(msg);
    }

    else if (intentFrom === 'discount.discount-yes.discount-yes-custom' ) {
      QueryType=intentParam.queryType;

      msg = {
        "messages": [
          {
          "type": 0,
          "platform": "facebook",
          "speech": "Excellent! Can you please specify your query on "+ QueryType
          }
         ]};
      return res.json(msg);
    }

else if(intentFrom === 'queryType'){
  msg = {
    "messages": [
   
        {
          "type": 4,
          "platform": "facebook",
          "payload":{
          "facebook":{
          "text": "Can you confirm your query type",
          "quick_replies_img": [
            {
                          "content_type":"text",
                          "title":"Risk Class",
                          "payload":"Risk Class"
                          
              },{
                "content_type":"text",
                "title":"Deductible",
                "payload":"Deductible"
                
    },
    {
      "content_type":"text",
      "title":"Discount",
      "payload":"Discount"
      
},
{
"content_type":"text",
"title":"Coverage",
"payload":"Coverage"

},
{
"content_type":"text",
"title":"Others",
"payload":"Others"

}
            
            ]}}
    
  }]};
}
else if(intentFrom === 'queryTypeMoreDetails'){
  QueryType=intentParam.queryType;
  console.log(QueryType);
  msg = { "messages": [
    {
    "type": 0,
    "platform": "facebook",
    "speech": "Excellent! Can you please specify your query on "+ QueryType
    }
   ]};
   return res.json(msg);
}
else if(intentFrom === 'riskClass'){
  RiskClass=intentParam.RiskClass;
  msg = {
     "messages": [
    {
    "type": 0,
    "platform": "facebook",
    "speech": "Ah Ok Thanks! 🙂 For the BOP Policy , the risk class should be <b>Candy and Other Confectionery Products (chocolate confectionery)</b>"
    },
    {
      "type": 4,
      "platform": "facebook",
      "payload":{
      "facebook":{
      "text": "Is there anything else I can help you with?",
      "quick_replies": [
        {
                      "content_type":"text",
                      "title":"Yes",
                      "payload":"Yes"
                      
          },{
            "content_type":"text",
            "title":"No",
            "payload":"No"
            
}
        
        ]}}

}
   ]};
   return res.json(msg);
}
else if(intentFrom === 'riskClass.riskClass-yes'){
  RiskClass=intentParam.RiskClass;
  msg = {
     "messages": [
       {
      "type": 4,
      "platform": "facebook",
      "payload":{
      "facebook":{
      "text": "Can you confirm your query type?",
      "quick_replies_img": [
        {
                      "content_type":"text",
                      "title":"Risk Class",
                      "payload":"Risk Class"
                      
          },{
            "content_type":"text",
            "title":"Deductible",
            "payload":"Deductible"
            
},{
  "content_type":"text",
  "title":"Discount",
  "payload":"Discount"
  
},{
  "content_type":"text",
  "title":"Coverage",
  "payload":"Coverage"
  
},{
  "content_type":"text",
  "title":"Others",
  "payload":"Others"
  
}
        
        ]}}

}
   ]};
   return res.json(msg);
}
else if(intentFrom === 'selectDeductible'){
  msg={
    "speech": "",
    "displayText": "",
    "messages": [
      {
    "type": 0,
    "platform": "facebook",
    "speech": "Ah Sorry !!!"
    },
    {
      "type": 0,
      "platform": "facebook",
      "speech": "I am unable to help you on this. Click here to conect with a senior underwriter or you can call your Agency Manager <b>Mr. John</b> @ <b>732 313 4444</b>"
      },
      {
      "type": 4,
      "platform": "facebook",
      "payload":{
      "facebook":{
      "text": "Is there anything else I can help you with?",
      "quick_replies":[{
        "content_type":"text",
        "title":"Yes",
        "payload":"Yes"
      },{
        "content_type":"text",
        "title":"No",
        "payload":"No"
      }]}}

}
  
  ]

    };
   return res.json(msg);
}
else if(intentFrom === 'coverage.coverage-yes'){
  RiskClass=intentParam.RiskClass;
  msg = {
     "messages": [
       {
      "type": 4,
      "platform": "facebook",
      "payload":{
      "facebook":{
      "text": "Can you confirm your query type?",
      "quick_replies_img": [
        {
                      "content_type":"text",
                      "title":"Risk Class",
                      "payload":"Risk Class"
                      
          },{
            "content_type":"text",
            "title":"Deductible",
            "payload":"Deductible"
            
},{
  "content_type":"text",
  "title":"Discount",
  "payload":"Discount"
  
},{
  "content_type":"text",
  "title":"Coverage",
  "payload":"Coverage"
  
},{
  "content_type":"text",
  "title":"Others",
  "payload":"Others"
  
}
        
        ]}}

}
   ]};
   return res.json(msg);
}
else if(intentFrom === 'coverage.coverage-yes.coverage-yes-custom'){
  QueryType=intentParam.queryType;
  msg = { "messages": [
    {
    "type": 0,
    "platform": "facebook",
    "speech": "Excellent! Can you please specify your query on "+ QueryType
    }
   ]};
   return res.json(msg);
}
});



//POST Call Endpoint




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


