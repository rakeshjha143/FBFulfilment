
const Sentiment = require('sentiment');
var express = require('express');
var session = require('express-session')
var bodyParser = require('body-parser');
var requestAPI = require('request');
const image2base64 = require('image-to-base64');
const roundTo = require('round-to');

var commonFiles = require('./util/commonfiles');
var addressify = require('./util/addressify').checkAddressify;


app = express();


var port = process.env.PORT || 5000;

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('trust proxy', 1) // trust first proxy


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
var  claimno;
var  lossDate;
var  lossType;
var  lossCause;
var  description;
var  price;
var  height;
var  width;
var  thickness;
var  glassType;
var  windowType;
var  gSize;
var  h;
var  w;
var  t;

function checkItem(query, message) {
  message.messages[0].payload.facebook.quick_replies.forEach((item) => {
    if (item.title == query) {
      item.selected = true;
    } else {
      delete item.selected;
    }
  });
  console.log("Before send");
  return message;
}

async function priceConverter(req, res) {
  console.log("glassType: " + glassType + "windowType: " + windowType)
  console.log("h: " + h + "w: " + w + "t: " + t)
  var options = {
    method: 'POST',
    url: 'http://35.154.116.87:7999/aa/getMockGlassCost',
    headers:
      {
        'postman-token': '225193bc-ade0-bb34-6a7e-b6e8851b7c3b',
        'cache-control': 'no-cache',
        'content-type': 'application/json'
      },
    body:
      {
        height: h,
        width: w,
        thickness: t,
        glassType: glassType,
        windowType: windowType
      },
    json: true
  };
  return new Promise((resolve, reject) => {
    requestAPI(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        var validprice = body;
        price = roundTo(validprice.glassCost, 0);
        console.log(price);
        return resolve(price);
      } else {
        return reject(error);
      }


    });
  }
  )


}
async function CreateClaim(req, res) {
  console.log('inside create claim------------');
  var options = {
    method: 'POST',

    url: 'http://35.154.116.87:8080/cc/service/edge/fnol/cfnol',

    headers:

      {
        'postman-token': 'ff149a5b-daaf-0000-0b8c-5301c162be75',

        'cache-control': 'no-cache',

        authorization: 'Basic c3U6Z3c=',

        accept: 'application/json',

        'content-type': 'application/json'
      },

    body:

      {
        jsonrpc: '2.0',

        method: 'createClaimForHomeOwners',

        params:

          [{
            lossDate: lossDate + 'T00:00:00Z',

            lossType: 'PR',

            lossCause: 'glassbreakage',

            description: 'windowcrashed'
          }]
      },

    json: true
  };


  return new Promise((resolve, reject) => {
    console.log("Inside promise");
    //return resolve("000-00-000255");

    requestAPI(options, function (error, response, body) {
      console.log('2------------', body);


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


  if (intentFrom === 'input.welcome') {
    msg = {
      "speech": "",
      "displayText": "",
      "messages": [
        {
          "type": 4,
          "platform": "facebook",
          "payload": {
            "facebook": {
              "text": "What do you need assitance with?",
              "quick_replies": [{
                "content_type": "text",
                "title": "Claims",
                "payload": "Claims"

              },
              {
                "content_type": "text",
                "title": "Policy Change",
                "payload": "Policy Change"
              },
              {
                "content_type": "text",
                "title": "Renewal",
                "payload": "Renewal"
              }, {
                "content_type": "text",
                "title": "Quote",
                "payload": "Quote"
              }
              ]
            }
          }
        }
      ]
    };
    return res.json(msg);
  }
  else if (intentFrom === 'input.Underwriting') {
    msg = {
    
      "speech": "",
      "displayText": "",
      "messages": [{
        "type": 0,
        "platform": "facebook",
        "speech": "Hi There, I'm Macy! Your friendly Quote Assistant. How can I help you today?"
      }]
    }
    return res.json(msg);
  }
  else if (intentFrom === 'input.Claim02') {
    msg = {
      "speech": "",
      "displayText": "",
      "messages": [
        {
          "type": 4,
          "platform": "facebook",
          "payload": {
            "facebook": {
              "text": "What do you want to claim for?",
              "quick_replies": [
                {
                  "content_type": "text",
                  "title": "Applicance Breakdown",
                  "payload": "Applicance Breakdown"
                },
                {
                  "content_type": "text",
                  "title": "Glass Breakage",
                  "payload": "Glass Breakage"
                },
                {
                  "content_type": "text",
                  "title": "Water Leakage",
                  "payload": "Water Leakage"
                },
                {
                  "content_type": "text",
                  "title": "Theft",
                  "payload": "Theft"
                }
              ]
            }
          }
        }
      ]
    };
    return res.json(msg);
  } else if (intentFrom === 'input.ChooseClaim') {
    msg = {
      "speech": "",
      "displayText": "",
      "messages": [/*{
        "type":0,
        "platform":"facebook",
        "speech":"Sorry about that. We'll help you get this claim sorted out in no time."
      },*/
        {
          "type": 4,
          "platform": "facebook",
          "payload": {
            "facebook": {
              "text": "Is the Claim related to your Auto, Home or Businessowners policy?",
              "quick_replies_img": [{
                "content_type": "text",
                "title": "Auto",
                "payload": "Auto"
              }, {
                "content_type": "text",
                "title": "Home",
                "payload": "Home"
              }, {
                "content_type": "text",
                "title": "Business",
                "payload": "BusinessOwners"
              }]
            }
          }
        }
      ]
    };
    return res.json(msg);
    //,
    //"image_url":"avatar/image/Auto.svg"
  } else if (intentFrom === 'input.policy') {
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
          "payload": {
            "facebook": {
              "text": "When did the incident occur? Select from below or enter in MM/DD/YYYY format",
              "quick_replies": [
                {
                  "content_type": "text",
                  "title": "Today",
                  "payload": "Today"

                }, {
                  "content_type": "text",
                  "title": "Yesterday",
                  "payload": "Yesterday"

                }

              ]
            }
          }

        }]
    };
    return res.json(msg);
  }

  else if (intentFrom === 'input.date') {

    lossDate = intentParam.date;
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

  else if (intentFrom === 'upload_image') {

    windowType = intentParam.WindowType;
    console.log("#####" + windowType);
    glassType = intentParam.ClaimGlassType;
    console.log(glassType);

    msg = {
      "speech": "",
      "displayText": "",
      "messages": [{
        "type": 4,
        "platform": "facebook",
        "payload": {
          "facebook": {
            "text": "Can you validate the type of window? You can select another one if the suggested window type is not correct",
            "quick_replies": [
              {
                "content_type": "text",
                "title": "Single Hung Windows",
                "payload": "Single Hung Windows",
                "selected": true
              },
              {
                "content_type": "text",
                "title": "Double Hung Windows",
                "payload": "Double Hung Windows"

              },  {
                "content_type": "text",
                "title": "Awning Window",
                "payload": "Awning Window"

              },
              {
                "content_type": "text",
                "title": "Arched Windows",
                "payload": "Arched Windows"

              },
              {
                "content_type": "text",
                "title": "Bay Windows",
                "payload": "Bay Windows",

              },
              {
                "content_type": "text",
                "title": "Bow Windows",
                "payload": "Bow Windows",

              },
              {
                "content_type": "text",
                "title": "Casement Windows",
                "payload": "Casement Windows",

              }, {
                "content_type": "text",
                "title": "Egress Windows",
                "payload": "Egress Windows",

              }, {
                "content_type": "text",
                "title": "Garden Windows",
                "payload": "Garden Windows",

              }, {
                "content_type": "text",
                "title": "Glass Block Windows",
                "payload": "Glass Block Windows",

              }, {
                "content_type": "text",
                "title": "Hopper Windows",
                "payload": "Hopper Windows",

              },
              {
                "content_type": "text",
                "title": "Jalousie Windows",
                "payload": "Jalousie Windows",

              },
              {
                "content_type": "text",
                "title": "Picture Windows",
                "payload": "Picture Windows",

              },
              {
                "content_type": "text",
                "title": "Round Circle Windows",
                "payload": "Round Circle Windows",

              },
              {
                "content_type": "text",
                "title": "Skylight Windows",
                "payload": "Skylight Windows",

              },
              {
                "content_type": "text",
                "title": "Sliding Windows",
                "payload": "Sliding Windows",

              },
              {
                "content_type": "text",
                "title": "Storm Windows",
                "payload": "Storm Windows",

              },
              {
                "content_type": "text",
                "title": "Transom Windows",
                "payload": "Transom Windows",

              }

            ]


          }
        }
      }
      ]

    };
    //msg=await checkItem(windowType,msg);
    console.log("Before check Item");
    return res.json(msg);
  }


  else if (intentFrom === 'input.windows') {
    console.log(intentParam);
    windowType = intentParam.Windows;
    console.log(windowType);

    msg = {
      "speech": "",
      "displayText": "",
      "messages": [
        {
          "type": 4,
          "platform": "facebook",
          "payload": {
            "facebook": {
              "text": "Can you validate the type of glass? You can select another one if the suggested glass type is not correct",
              "quick_replies": [
                {
                  "content_type": "text",
                  "title": "Float Glass",
                  "payload": "Float Glass",
                  "selected": true
                },
                {
                  "content_type": "text",
                  "title": "Safety Laminated Glass",
                  "payload": "Safety Laminated Glass"

                },
                {
                  "content_type": "text",
                  "title": "Obscured Glass",
                  "payload": "Obscured Glass"

                },
                {
                  "content_type": "text",
                  "title": "Annealed Glass",
                  "payload": "Annealed Glass",

                },
                {
                  "content_type": "text",
                  "title": "Tinted Glass",
                  "payload": "Tinted Glass",

                },
                {
                  "content_type": "text",
                  "title": "Tempered Glass",
                  "payload": "Tempered Glass",

                }, {
                  "content_type": "text",
                  "title": "Insulated Glass",
                  "payload": "Insulated Glass",

                }, {
                  "content_type": "text",
                  "title": "Mirrored Glass",
                  "payload": "Mirrored Glass",

                }, {
                  "content_type": "text",
                  "title": "Low-E Glass",
                  "payload": "Low-E Glass",

                }, {
                  "content_type": "text",
                  "title": "Wired Glass",
                  "payload": "Wired Glass",

                },
                {
                  "content_type": "text",
                  "title": "Heat Strengthened Glass",
                  "payload": "Heat Strengthened Glass",

                }]
            }
          }
        }
      ]

    }
    //msg=await checkItem(glassType,msg);
    console.log("Before check Item");
    return res.json(checkItem(glassType, msg));
  }
  else if (intentFrom === 'input.sizeOfglass') {
    glassType = intentParam.GlassType;
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
          "payload": {
            "facebook": {
              "text": "Select the correct size of the glass or enter as Height (inch) x Width (inch) x Thickness (mm)",
              "quick_replies": [
                {
                  "content_type": "text",
                  "title": "24*24*6",
                  "payload": "24*24*6"
                },
                {
                  "content_type": "text",
                  "title": "36*36*6",
                  "payload": "36*36*6"

                },
                {
                  "content_type": "text",
                  "title": "24*36*4",
                  "payload": "24*36*4"

                },
                {
                  "content_type": "text",
                  "title": "48*48*6",
                  "payload": "48*48*6",

                },
                {
                  "content_type": "text",
                  "title": "36*48*6",
                  "payload": "36*48*6",

                }

              ]


            }
          }
        }
      ]

    };
    //msg=await checkItem(windowType,msg);
    //    console.log("Before check Item");
    return res.json(msg);
  }


  else if (intentFrom === 'input.GlassSize') {
    gSize = intentParam.GlassSize;
    h = intentParam.number1;
    w = intentParam.number2;
    t = intentParam.number3;
    console.log(gSize);

    await CreateClaim(req, res).then(async (claimno) => {

      if (claimno) {
        console.log("Claim Number" + claimno);
        await priceConverter(req, res).then((price) => {
          console.log("Claim Number" + price);
          msg = {
            "speech": "",
            "displayText": "",
            "messages": [{
              "type": 0,
              "platform": "facebook",
              "speech": "Your Claim number is CL  " + claimno
            }, {
              "type": 0,
              "platform": "facebook",
              "speech": "Based on the quotes received from the market, you are entitled to a claims payment of $" + price +
                ". We've added an additional 10% to the market rates to cover any additional expenses that you may incur. "
            }, {
              "type": 4,
              "platform": "facebook",
              "payload": {
                "facebook": {
                  "text": "Do you want to know of  other repair options?",
                  "quick_replies": [
                    {
                      "content_type": "text",
                      "title": "Yes",
                      "payload": "Yes"

                    }, {
                      "content_type": "text",
                      "title": "No",
                      "payload": "No"

                    }

                  ]
                }
              }

            }
            ]

          };
          return res.json(msg);
        });


      }
    });

    //if(price!=null){



  }
  else  if (intentFrom  ===  'otherOption') {
    msg = {
      "speech":  "",
      "displayText":  "",
      "messages":  [{
        "type":  0,
        "platform":  "facebook",
        "speech":  "We can get the glazing repaired for you, which would take 2 weeks to complete <br><br>Alternatively, you can send us a quote from a glazier and we'll pay out the claim"
      }, {
        "type": 4,
        "platform": "facebook",
        "payload": {
          "facebook": {
            "text": "Please select an option for us to proceed further",
            "quick_replies_img": [{
              "content_type": "text",
              "title": "Cash Payment",
              "payload": "Cash Payment"
            }, {
              "content_type": "text",
              "title": "Repair",
              "payload": "Repair"
            }, {
              "content_type": "text",
              "title": "Self Quotes",
              "payload": "Self Quotes"
            }]
          }
        }

      }

      ]

    };
    return  res.json(msg);
  }
  else if (intentFrom === 'input.Cash_10') {
    msg = {
      "speech":  "",
      "displayText":  "",
      "messages":  [{
        "type":  0,
        "platform":  "facebook",
        "speech":  "Excellent! We'll initiate the wire transfer of this amount into your bank account, <br><br>associated with our records, within 24 hours"
      }]
    };
    return res.json(msg);
  }
  else  if (intentFrom  ===  'input.cancel') {
    msg = {

      "messages":  [{
        "type": 4,
        "platform": "facebook",
        "payload": {
          "facebook": {
            "text": "Here is a quick reply!",
            "quick_replies": [{
              "content_type": "text",
              "title": "Search",
              "payload": "<POSTBACK_PAYLOAD>",
              "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgEvw56_-w2K-Ml7Zc1gF5yXCWK02eOffT5uw6DkQzzGo230Dq_g"
            }]
          }
        }

      }

      ]

    };
    return  res.json(msg);
  }

  // Bot to Call ...
  else if (intentFrom === 'others') {
    msg = {
      "speech":  "",
      "displayText":  "",
      "messages":  [
        {
          "type":  0,
          "platform":  "facebook",
          "speech":  "Ah Sorry !!!"
        },
        {
          "type":  0,
          "platform":  "facebook",
          "speech":  "I am unable to help you on this. Click here to conect with a senior underwriter or you can call your Agency Manager <b>Mr. John</b> @ <b>732 313 4444</b>"
        }

      ]

    };
    return res.json(msg);
  }
  else if (intentFrom === 'input.discount') {
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
          "payload": {
            "facebook": {
              "text": "Is there anything else I can help you with?",
              "quick_replies": [
                {
                  "content_type": "text",
                  "title": "Yes",
                  "payload": "Yes"

                }, {
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


  else if (intentFrom === 'input.discount.discount-yes') {
    msg = {
      "messages": [

        {
          "type": 4,
          "platform": "facebook",
          "payload": {
            "facebook": {
              "text": "Can you confirm your query type",
              "quick_replies_img": [
                {
                  "content_type": "text",
                  "title": "Risk Class",
                  "payload": "Risk Class"

                }, {
                  "content_type": "text",
                  "title": "Deductible",
                  "payload": "Deductible"

                },
                {
                  "content_type": "text",
                  "title": "Discount",
                  "payload": "Discount"

                },
                {
                  "content_type": "text",
                  "title": "Coverage",
                  "payload": "Coverage"

                },
                {
                  "content_type": "text",
                  "title": "Others",
                  "payload": "Others"

                }

              ]
            }
          }

        }]
    };
    return res.json(msg);
  }
  else if (intentFrom === 'higherDeductible') {
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
          "payload": {
            "facebook": {
              "text": "Is there anything else I can help you with?",
              "quick_replies": [
                {
                  "content_type": "text",
                  "title": "Yes",
                  "payload": "Yes"

                }, {
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
  else if (intentFrom === 'higherDeductible.higherDeductible-yes') {
    msg = {
      "speech":  "",
      "displayText":  "",
      "messages":  [{
        "type": 4,
        "platform": "facebook",
        "payload": {
          "facebook": {
            "text": "Can you confirm your query type",
            "quick_replies_img": [{
              "content_type": "text",
              "title": "Risk Class",
              "payload": "Risk Class"
            }, {
              "content_type": "text",
              "title": "Deductible",
              "payload": "Deductible"
            }, {
              "content_type": "text",
              "title": "Discount",
              "payload": "Discount"
            }, {
              "content_type": "text",
              "title": "Coverage",
              "payload": "Coverage"
            }, {
              "content_type": "text",
              "title": "Others",
              "payload": "Others"
            }
            ]
          }
        }

      }

      ]

    };
    return res.json(msg);
  }

  else if (intentFrom === 'higherDeductible.higherDeductible-yes.higherDeductible-yes-custom') {
    QueryType = intentParam.queryType;
    console.log(QueryType);
    msg = {
      "messages": [
        {
          "type": 0,
          "platform": "facebook",
          "speech": "Excellent! Can you please specify your query on " + QueryType
        }
      ]
    };
    return res.json(msg);
  }

  else if (intentFrom === 'discount.discount-yes.discount-yes-custom') {
    QueryType = intentParam.queryType;
    console.log(QueryType);
    msg = {
      "messages": [
        {
          "type": 0,
          "platform": "facebook",
          "speech": "Excellent! Can you please specify your query on " + QueryType
        }
      ]
    };
    return res.json(msg);
  }


  else if (intentFrom === 'riskClass') {
    RiskClass = intentParam.RiskClass;
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
          "payload": {
            "facebook": {
              "text": "Is there anything else I can help you with?",
              "quick_replies": [
                {
                  "content_type": "text",
                  "title": "Yes",
                  "payload": "Yes"

                }, {
                  "content_type": "text",
                  "title": "No",
                  "payload": "No"

                }

              ]
            }
          }

        }
      ]
    };
    return res.json(msg);
  }
  else if (intentFrom === 'riskClass.riskClass-yes') {
    RiskClass = intentParam.RiskClass;
    msg = {
      "messages": [
        {
          "type": 4,
          "platform": "facebook",
          "payload": {
            "facebook": {
              "text": "Can you confirm your query type?",
              "quick_replies_img": [
                {
                  "content_type": "text",
                  "title": "Risk Class",
                  "payload": "Risk Class"

                }, {
                  "content_type": "text",
                  "title": "Deductible",
                  "payload": "Deductible"

                }, {
                  "content_type": "text",
                  "title": "Discount",
                  "payload": "Discount"

                }, {
                  "content_type": "text",
                  "title": "Coverage",
                  "payload": "Coverage"

                }, {
                  "content_type": "text",
                  "title": "Others",
                  "payload": "Others"

                }

              ]
            }
          }

        }
      ]
    };
    return res.json(msg);
  }
  else if (intentFrom === 'selectDeductible') {
    msg = {
      "speech":  "",
      "displayText":  "",
      "messages":  [
        {
          "type":  0,
          "platform":  "facebook",
          "speech":  "Ah Sorry !!!"
        },
        {
          "type":  0,
          "platform":  "facebook",
          "speech":  "I am unable to help you on this. Click here to conect with a senior underwriter or you can call your Agency Manager <b>Mr. John</b> @ <b>732 313 4444</b>"
        },
        {
          "type": 4,
          "platform": "facebook",
          "payload": {
            "facebook": {
              "text": "Is there anything else I can help you with?",
              "quick_replies": [{
                "content_type": "text",
                "title": "Yes",
                "payload": "Yes"
              }, {
                "content_type": "text",
                "title": "No",
                "payload": "No"
              }]
            }
          }

        }

      ]

    };
    return res.json(msg);
  }
  else if (intentFrom === 'coverage.coverage-yes') {
    RiskClass = intentParam.RiskClass;
    msg = {
      "messages": [
        {
          "type": 4,
          "platform": "facebook",
          "payload": {
            "facebook": {
              "text": "Can you confirm your query type?",
              "quick_replies_img": [
                {
                  "content_type": "text",
                  "title": "Risk Class",
                  "payload": "Risk Class"

                }, {
                  "content_type": "text",
                  "title": "Deductible",
                  "payload": "Deductible"

                }, {
                  "content_type": "text",
                  "title": "Discount",
                  "payload": "Discount"

                }, {
                  "content_type": "text",
                  "title": "Coverage",
                  "payload": "Coverage"

                }, {
                  "content_type": "text",
                  "title": "Others",
                  "payload": "Others"

                }

              ]
            }
          }

        }
      ]
    };
    return res.json(msg);
  }
  else if (intentFrom === 'coverage.coverage-yes.coverage-yes-custom') {
    QueryType = intentParam.queryType;
    msg = {
      "messages": [
        {
          "type": 0,
          "platform": "facebook",
          "speech": "Excellent! Can you please specify your query on " + QueryType
        }
      ]
    };
    return res.json(msg);
  }
  else if (intentFrom === 'input.querytype') {
    //console.log(intentFrom === 'queryType');
    msg = {
      "messages": [

        {
          "type": 4,
          "platform": "facebook",
          "payload": {
            "facebook": {
              "text": "Can you confirm your query type",
              "quick_replies_img": [
                {
                  "content_type": "text",
                  "title": "Risk Class",
                  "payload": "Risk Class"

                }, {
                  "content_type": "text",
                  "title": "Deductible",
                  "payload": "Deductible"

                },
                {
                  "content_type": "text",
                  "title": "Discount",
                  "payload": "Discount"

                },
                {
                  "content_type": "text",
                  "title": "Coverage",
                  "payload": "Coverage"

                },
                {
                  "content_type": "text",
                  "title": "Others",
                  "payload": "Others"

                }

              ]
            }
          }

        }]
    };
    
    return res.json(msg);
  }
  else if (intentFrom === 'queryTypeMoreDetails') {
    QueryType = intentParam.queryType;
    console.log(QueryType);
    msg = {
      "messages": [
        {
          "type": 0,
          "platform": "facebook",
          "speech": "Excellent! Can you please specify your query on " + QueryType
        }
      ]
    };
    return res.json(msg);
  }

else if(intentFrom === 'input.Renewal') {
  msg = {
    "speech": "",
    "displayText": "",
    "messages": [
      {
        "type": 4,
        "platform": "facebook",
        "payload": {
          "facebook": {
            "text": "What do you need assitance with?",
            "quick_replies": [{
              "content_type": "text",
              "title": "Claims",
              "payload": "Claims"

            },
            {
              "content_type": "text",
              "title": "Policy Change",
              "payload": "Policy Change"
            },
            {
              "content_type": "text",
              "title": "Renewal",
              "payload": "Renewal"
            }, {
              "content_type": "text",
              "title": "Quote",
              "payload": "Quote"
            }
            ]
          }
        }
      }
    ]
  };
  return res.json(msg);
}
else if(intentFrom === 'input.PolicyChange') {
  msg = {
    "speech": "",
    "displayText": "",
    "messages": [
      {
        "type": 4,
        "platform": "facebook",
        "payload": {
          "facebook": {
            "text": "What do you need assitance with?",
            "quick_replies": [{
              "content_type": "text",
              "title": "Claims",
              "payload": "Claims"

            },
            {
              "content_type": "text",
              "title": "Policy Change",
              "payload": "Policy Change"
            },
            {
              "content_type": "text",
              "title": "Renewal",
              "payload": "Renewal"
            }, {
              "content_type": "text",
              "title": "Quote",
              "payload": "Quote"
            }
            ]
          }
        }
      }
    ]
  };
  return res.json(msg);
}
   
});



//POST Call Endpoint

app.listen(port);


