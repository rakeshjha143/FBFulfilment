//const Twitter = require('twitter');
const Sentiment = require('sentiment');
var express = require('express');
var session = require('express-session')
//onst MongoStore = require('connect-mongo')(session);
//const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var requestAPI = require('request');
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
var getDetails;
var newQuoteobj = '';
newQuoteobj = new commonFiles.newQuote();
getDetails = new commonFiles.getDetails();
var profileDetails = new commonFiles.profileDetails()
var latestSN = new commonFiles.latestSN();
app.post("/fulfillment", async function (req, res) {

  // Service now status
  
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
  
  // Input.welcome -----------
  if (intentFrom === 'input.welcome' ) {
    msg = {
      "speech": "",
      "displayText": "",
      "messages": [{
        "type": 0,
        "platform": "facebook",
        "speech": "Hello. I'm Macy! How can help you today? Enter your question below and I'll help you find the information you need"
      }]
      
    };
    return res.json(msg);
  } else if(intentFrom === 'input.glassClaim') {
    msg = {
      "messages":[{
        "type":0,
        "platform":"facebook",
        "speech":"Sorry about that. We'll help you get this claim sorted out in no time."
      },
      {
        "type":4,
        "platform":"facebook",
        "payload":{
          "facebook":{
            "text":"Is it related to your Auto, Home or Businessowners policy?",
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
      "speech": "",
      "displayText": "",
      "messages": [{
        "type": 0,
        "platform": "facebook",
        "speech": "Thanks for the details! Please hold on, while we check your coverage details <br><br>Happy to inform that your broken window is covered under your Homeowners policy <br><br> We'll need some more information to help you with the claim processing <br><br>When did the accident occur ? example It happened on 31st Aug / Yesterday / Today / Day"
      }]
      
    };
    return res.json(msg);
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


