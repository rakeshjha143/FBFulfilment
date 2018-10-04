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
                    }]
                    
                  };
                  return res.json(msg);
                });
              
                
}});