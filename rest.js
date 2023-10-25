var express = require('express');
var app = express();
var fs = require("fs");

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');

app.get('/api/view/:name', function (req, res) {
   var timeStart=new Date();
   
   console.log(req.params.name)
   res1=check(req.params.name).then(function(e){
    console.log("find over"); 
    try{
    ee=JSON.parse(e);
    fs.readFile(__dirname + "/"+ee.model+".txt", 'utf8', function (err, data) {
      /*var timeEnd=new Date();
      //console.log( data );
      console.log("response",timeStart-timeEnd)
      console.log("end ",timeStart.valueOf());*/
      //data['time']=timeStart-timeEnd;
      //var result={"result":data,'time':timeStart-timeEnd};
      res.end(data);
  });
}catch(err){}
   });
   
})

async function check(target) {
  try {
      
      // load the network configuration
      const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a new file system based wallet for managing identities.
      const walletPath = path.join(process.cwd(), 'wallet');
      const wallet = await Wallets.newFileSystemWallet(walletPath);
      console.log(`Wallet path: ${walletPath}`);

      // Check to see if we've already enrolled the user.
      const identity = await wallet.get('appUser');
      if (!identity) {
          console.log('An identity for the user "appUser" does not exist in the wallet');
          console.log('Run the registerUser.js application before retrying');
          return;
      }

      // Create a new gateway for connecting to our peer node.
      const gateway = new Gateway();
      await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');

      // Get the contract from the network.
      const contract = network.getContract('fabcar');
      var timeStart=new Date();
      //sleep(2000);
      // Evaluate the specified transaction.
      // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
      // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
      const result = await contract.evaluateTransaction('queryCar',target);
      /*var timeEnd=new Date();
      console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
      console.log("run as",timeEnd-timeStart);
      //const result2 = await contract.submitTransaction('changeCarOwner', '1k', 'HaIWA');
     
      var timeEnd2=new Date();
      console.log("submit as",timeEnd2-timeEnd);
      console.log(res1.model);*/
    
      // Disconnect from the gateway.
      await gateway.disconnect();
      //console.log(result);
      return result.toString();
      
  } catch (error) {
      console.error(`Failed to evaluate transaction: ${error}`);
      //process.exit(1);
  }
}
var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("访问地址为 http://%s:%s", host, port)
})


function sleep(time){
    var timeStamp = new Date().getTime();
    var endTime = timeStamp + time;
    while(true){
    if (new Date().getTime() > endTime){
     return;
    } 
    }
   }