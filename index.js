const express = require('express')
const app = express()
const port = 80
var mysql = require('mysql');
var connection = mysql.createConnection({host:'127.0.0.1',user:'root',password:'',database:'panel'}); 
global.db = connection;
var CryptoJS = require("crypto-js");

app.get('/apis/:key', function (req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  connection.query('SELECT * FROM ac WHERE ip = ?', [req.params.key], function(error, results, fields) {
    if (results.length > 0) {
      if (results[0].auth == "true") {
        if (results[0].time>Date.now()) {
          res.send(CryptoJS.AES.encrypt(JSON.stringify({"auth":"true","server":Date.now(),"ip":ip}), 'A2CB6CAD5CB293E2001B9FF3E235AF1E').toString());
      }else{
        res.send(CryptoJS.AES.encrypt(JSON.stringify({"auth":"expired","server":Date.now(),"ip":ip}), 'A2CB6CAD5CB293E2001B9FF3E235AF1E').toString());
    }
      } else if (results[0].auth == "blacklist") {
        res.send(CryptoJS.AES.encrypt(JSON.stringify({"auth":"blacklist","server":Date.now(),"ip":ip}), 'A2CB6CAD5CB293E2001B9FF3E235AF1E').toString());
      } else {
        res.send(CryptoJS.AES.encrypt(JSON.stringify({"auth":"false","server":Date.now(),"ip":ip}), 'A2CB6CAD5CB293E2001B9FF3E235AF1E').toString());
      }
    } else {
      res.send(CryptoJS.AES.encrypt("Fuck OFF", 'A2CB6CAD5CB293E2001B9FF3E235AF1E').toString());
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


// Decrypt
// var bytes = CryptoJS.AES.decrypt("U2FsdGVkX19ZuiXqF1+FiyfDraYOv6oEjjJS1sqjWqsmYxk1438QfG1AGxXQctTx", 'A2CB6CAD5CB293E2001B9FF3E235AF1E')
// var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

// console.log(decryptedData)