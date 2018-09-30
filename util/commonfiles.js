const requestAPI = require('request');
var fs = require('fs');
var moment = require('moment-timezone');
const ServiceNowUserName = process.env.ServiceNowUserName; // 'admin';
const ServiceNowPwd = process.env.ServiceNowPwd; //'pj10GXYsUTej';


const header = {
    'Cache-Control': 'no-cache',
    Accept: 'application/json',
    'Content-Type': 'application/json'
};

const apiList = {
    'SERVICEREQUEST': `https://dev27698.service-now.com/api/now/table/u_servicerequest`,
    'SERVICEREQUESTPATCH': `https://dev27698.service-now.com/api/now/table/u_servicerequest/`,
    'GETPLAN': "https://dev27698.service-now.com/api/now/table/u_servicerequest?sysparm_limit=1",
    'ADDRESSNUMSMSAPI': `http://smsapi.24x7sms.com/api_2.0/SendSMS.aspx?APIKEY=ZY2nHm2RiIC&MobileNo=phonenumber&SenderID=TESTIN&Message=Hello name, Your type will be updated on or before deadline. Ticket is SR - SRID.&ServiceName=TEMPLATE_BASED`,
    'PLANCHANGESMSAPI': `http://smsapi.24x7sms.com/api_2.0/SendSMS.aspx?APIKEY=ZY2nHm2RiIC&MobileNo=phonenumber&SenderID=TESTIN&Message=Hello name, Your $45 mobile plan is now active. Enjoy unlimited nationwide talk and text and 15GB data with a bonus of 15GB data.&ServiceName=TEMPLATE_BASED`,
    'ADDRESSIFYAPI': `https://api.addressify.com.au/addresspro/autocomplete?api_key=${process.env.addressifyToken}&term=addrString`,
    'ADDRESSIFYAPISUBURB': `https://api.addressify.com.au/address/suburbStatePostcodeAutoComplete?api_key=${process.env.addressifyToken}&term=addrString`,
    'WRITEINCOMPLETETRAN': `http://ec2-18-232-207-49.compute-1.amazonaws.com:7000/writeIncompleteTran`,
    'GETINCOMPLETETRAN': `http://ec2-18-232-207-49.compute-1.amazonaws.com:7000/getIncompleteStatus?ChatId=CHATID`
};

var callServiceNowApi = function (dataService, type, callback) {
    try {
        var options = {
            url: apiList[type],
            method: 'POST',
            header: header,
            body: dataService,
            json: true,
            auth: {
                user: 'admin',
                password: 'Htplcext#001'
            }
        };

        requestAPI(options, function (error, response, body) {
            if (error) {
                console.log('API ERROR', JSON.stringify(error));
                callback(error, false);
            } else {
                console.log('headers:', JSON.stringify(response.headers));
                console.log('status code:', JSON.stringify(response.statusCode));
                callback(null, body);
            }
        });
    } catch (err) {
        console.log('RESPONSE ERROR', JSON.stringify(err));
    }
};

var callServiceNowApiPATCH = function (dataService, type, sys_id, callback) {
    try {
        var options = {
            url: apiList[type]+'/'+sys_id,
            method: 'PATCH',
            header: header,
            body: dataService,
            json: true,
            auth: {
                user: 'admin',
                password: 'Htplcext#001'
            }
        };
        //console.log('URL ============ ',apiList[type]+'sys_id')
        requestAPI(options, function (error, response, body) {
            if (error) {
                console.log('API ERROR', JSON.stringify(error));
                callback(error, false);
            } else {
                console.log('headers:', JSON.stringify(response.headers));
                console.log('status code:', JSON.stringify(response.statusCode));
                callback(null, body);
            }
        });
    } catch (err) {
        console.log('RESPONSE ERROR', JSON.stringify(err));
    }
};

var getServiceNowIncidents = function (type, qs, callback) {
    try {
        var options = {
            url: apiList[type] + '&' + qs,
            method: 'GET',
            json: true,
            auth: {
                user: 'admin',
                password: 'Htplcext#001'
            }
        };

        requestAPI(options, function (error, response, body) {
            if (error) {
                console.log('API ERROR', JSON.stringify(error));
                callback(error, false);
            } else {
                console.log('headers:', JSON.stringify(response.headers));
                console.log('status code:', JSON.stringify(response.statusCode));
                console.log('body:', JSON.stringify(body));
                callback(null, body);
            }
        });
    } catch (err) {
        console.log('RESPONSE ERROR', JSON.stringify(err));
    }
};

var sendSMSApi = function (smscontent, phonenumber, name, type, date, SRID, callback) {
    try {
        phonenumber = '919710824685';
        name = 'Ms.Charlotte';
        var smsApi = apiList[smscontent].replace('phonenumber', phonenumber);
        smsApi = smsApi.replace('name', name);
        smsApi = smsApi.replace('type', type);
        smsApi = smsApi.replace('deadline', date);
        smsApi = smsApi.replace('SRID', SRID);
        console.log(smsApi, phonenumber);

        requestAPI(smsApi, function (error, response, body) {
            if (error) {
                console.log('API ERROR', JSON.stringify(error));
                callback(error, false);
            } else {
                console.log('headers:', JSON.stringify(response.headers));
                console.log('status code:', JSON.stringify(response.statusCode));
                callback(null, true);
            }
        });
    } catch (err) {
        console.log('RESPONSE ERROR', JSON.stringify(err));
    }
};

var writeIncompleteTran = function (data, status, pageFrom, callback) {
    try {
        console.log(data);

        let jsonData = {
            "ChatSession": data,
            "UserName": "Charlotte",
            "ChatPage": pageFrom,
            "IsTransactionComplete": status,
            "TransactionType": "BroadBand"
        };

        var options = {
            url: apiList["WRITEINCOMPLETETRAN"],
            method: 'POST',
            header: header,
            body: jsonData,
            json: true
        };
        console.log(options);

        requestAPI(options, function (error, response, body) {
            if (error) {
                console.log('API ERROR', JSON.stringify(error));
                callback(error, false);
            } else {
                console.log('headers:', JSON.stringify(response.headers));
                console.log('status code:', JSON.stringify(response.statusCode));
                callback(null, body);
            }
        });
    } catch (err) {
        console.log('RESPONSE ERROR', JSON.stringify(err));
        callback(err, null);
    }
};

var getIncompleteTran = function (chatId, callback) {
    try {
        console.log(chatId);
        var options = apiList["GETINCOMPLETETRAN"].replace('CHATID', chatId);
        // var options = {
        //     url: apiList["WRITEINCOMPLETETRAN"],
        //     method: 'GET',
        //     header: header,
        //     body: '',
        //     json: true
        // };
        console.log(options);

        requestAPI(options, function (error, response, body) {
            if (error) {
                console.log('API ERROR', JSON.stringify(error));
                callback(error, false);
            } else {
                console.log('headers:', JSON.stringify(response.headers));
                console.log('status code:', JSON.stringify(response.statusCode));
                callback(null, body);
            }
        });
    } catch (err) {
        console.log('RESPONSE ERROR', JSON.stringify(err));
        callback(err, null);
    }
};


var serviceNowEntity = function () {
    this.u_string_3 = null; //mobileno
    this.u_name = 'Charolette';
    this.u_choice_2 = 'mp';
    this.u_choice_1 = 'in progress';
    this.u_choice_4 = 'number';
    this.u_description = null; //desc
}

var latestSN = function () {
    this.sys_id = null;
    this.sr_no = null;
    
}
var serviceNowEntityAddress = function () {
    this.u_string_3 = null; //mobileno
    this.u_name = 'Charolette';
    this.u_choice_2 = 'hp';
    this.u_choice_1 = 'in progress';
    this.u_choice_4 = 'address';
    this.u_description = null; //desc
}

var getDetails = function () {
    this.u_name = 'Mukil';
    this.u_vehicle = 'Polo';
    this.u_garage = 'Cars india, kotivakkam';
    this.u_date = '';
    this.u_time = '';
    this.u_injury = '';
    this.u_fir = '';
    this.u_firno = '';
    //this.u_description = null; //desc
}
var profile = function () {
    var data = fs.readFileSync("profile.json", "utf8");
    var jsonArr = JSON.parse(data);
    return jsonArr;
    
}
var profileDetails = function () {
    // this.user_name = 'Mukil';
    // this.user_vehicle = 'TN-01-AB-1234';
    // this.user_vehicle_type = 'Swift';
    // this.vehicle_date = '2018-09-22';
    // this.diff = 15;
    this.details=[{
        'user_name':'Mukil',
        'user_vehicle':'TN-01-AB-1234',
        'user_vehicle_policy_no':'OG-14-1500-1800-01234567',
        'user_vehicle_make':'Maruthi',
        'user_vehicle_model':'Swift',
        'user_vehicle_type':'VDi',
        'vehicle_date':'2018-09-22',
        'diff':15
    },{
        'user_name':'Mukil',
        'user_vehicle':'TN-01-F-8966',
        'user_vehicle_policy_no':'OG-14-1500-1800-12121212',
        'user_vehicle_make':'Volkswagen',
        'user_vehicle_model':'Polo',
        'user_vehicle_type':'GT',
        'vehicle_date':'2019-09-30',
        'diff':15
    }]
}
var serviceNowEntityBroadband = function () {
    this.u_string_3 = null; //mobileno
    this.u_name = 'Charolette';
    this.u_choice_2 = 'hp';
    this.u_choice_1 = 'in progress';
    this.u_choice_4 = 'broadband';
    this.u_description = null; //desc
}

var welcomeMsg = function () {
    let curHr = moment().tz("Asia/Colombo").format("HH");
    if (curHr < 12) {
        return 'Hi Mukil Good Morning! ';
    } else if (curHr < 18) {
        return 'Hi Mukil Good Afternoon! ';
    } else {
        return 'Hi Mukil Good Evening! ';
    }
};

var validatePhoneNo = function (phoneNo, input) {
    if (phoneNo == '') {
        return input == "phone-number" ? "Can you provide your alternate number please?" : "Can you provide your phone number please?";
    } else if (isNaN(phoneNo)) {
        return "Looks like it has some non-numbers... Can you re-enter?";
    } else if (phoneNo.length != 10) {
        return "You need to enter a 10 digit phone number!"
    } else {
        return 'valid';
    }
};

var newQuote = function () {
    this.u_reg = null;
    this.u_make = null;
    this.u_model = null;
    this.u_variant = null;
    this.u_year = null;
    this.u_date = null;
    this.u_loan = null;
    this.u_access = null;
    this.copass = null;
    this.email = null;
    this.mobile = null;
}

var variantPrice = function () {
    this.LDI = 600000;
    this.VDI = 687000;
    this.AMTVDI = 734000;
    this.ZDI = 749000;
    this.AMTZDI = 796000;
    this.AMTZDIPlus = 876000;
    this.ZDIPlus = 829000;
    this.LXI = 500000;
    this.VXI = 587000;
    this.AMTVXI = 634000;
    this.ZXI = 649000;
    this.AMTZXI = 696000;
    this.AMTZXIPlus = 776000;
    this.ZXIPlus = 729000;
}

var validateDOB = function (date) {
    var dob = new Date(date);
    console.log('``````````````DOB``````````', dob);
    var currDate = new Date();
    console.log('``````````````Current Date``````````', currDate);
    var age = currDate.getFullYear() - dob.getFullYear();
    console.log('``````````````Age``````````', age);
    if (dob >= currDate) {
        console.log('``````````````False``````````');
        return false;
    } else if (age > 120) {
        console.log('``````````````False``````````');
        return false;
    } else {
        console.log('``````````````True``````````');
        return true;
    }
}

var callDialogflowAPI = function (eventArgs) {
    var data = {
        sessionId: 123456789,
        lang: "en",
        event: eventArgs
    };
    return new Promise(function (resolve, reject) {
        var options = {
            method: 'POST',
            url: 'https://api.api.ai/v1/query',
            qs: { v: '20150910' },
            headers:
            {
                'content-type': 'application/json',
                authorization: 'Bearer 5216486db5f1426899a1ff9afdd2cc93'
            },
            data: JSON.stringify(data),
            json: true
        };

        requestAPI(options, function (error, response, body) {
            if (error) {
                console.log('API ERROR', JSON.stringify(error));
                reject(error);
            } else {
                console.log('df headers:', JSON.stringify(response.headers));
                console.log('df status code:', JSON.stringify(response.statusCode));
                resolve(body);
            }
        });
    });

};

var fireDialogflowEvent = function (data) {
    return new Promise(function (resolve, reject) {
        var options = {
            method: 'POST',
            url: 'https://api.dialogflow.com/api/query',
            qs: { v: '20150910' },
            headers:
            {
                authorization: 'Bearer 5216486db5f1426899a1ff9afdd2cc93',
                'content-type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(data)
        };

        requestAPI(options, function (error, response, body) {
            if (error) {
                reject(error);
            };
            console.log('DF body', body);
            resolve(body);
        });
    });
};

module.exports.fireDialogflowEvent = fireDialogflowEvent;
module.exports.callServiceNowApi = callServiceNowApi;
module.exports.callServiceNowApiPATCH = callServiceNowApiPATCH;
module.exports.getServiceNowIncidents = getServiceNowIncidents;
module.exports.sendSMSApi = sendSMSApi;
module.exports.serviceNowEntity = serviceNowEntity;
module.exports.serviceNowEntityAddress = serviceNowEntityAddress;
module.exports.serviceNowEntityBroadband = serviceNowEntityBroadband;
module.exports.WelcomeMsg = welcomeMsg;
module.exports.apiList = apiList;
module.exports.validatePhoneNo = validatePhoneNo;
module.exports.validateDOB = validateDOB;
module.exports.writeIncompleteTran = writeIncompleteTran;
module.exports.getIncompleteTran = getIncompleteTran;
module.exports.getDetails = getDetails;
module.exports.newQuote = newQuote;
module.exports.variantPrice = variantPrice;
module.exports.callDialogflowAPI = callDialogflowAPI;
module.exports.profileDetails = profileDetails;
module.exports.profile = profile;
module.exports.latestSN = latestSN;