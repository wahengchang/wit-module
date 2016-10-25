var request = require('request');

var requestGetPromise = function(_url, _postHeaders){
  return new Promise(function(resolve, reject) {
    var options = {
      url: _url,
      headers: _postHeaders
    };
     
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        resolve(info)
      }
      else{
        reject(error)
      }
    });
  });
}


var requestPostPromise = function(_url, _postHeaders, _postData){
  return new Promise(function(resolve, reject) {
    var data = _postData || {}
    var options = {
      url: _url,
      headers: _postHeaders,
      method: 'POST',
      body: JSON.stringify(data)
    };
     
    request(options, function (error, response, body) {

      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        resolve(info)
      }
      else{
        reject(error)
      }
    });
  });
}



var WIT = function (_witToken) {
  this.token = _witToken;
  console.log(' init wit token: '+ this.token)
}


WIT.findTheater = function (entities) {
  return new Promise(function(resolve, reject) {
    resolve('TheaterA')
  })
}

WIT.prototype.send = function (_str) {
  var URL = 'https://api.wit.ai/message?v=20161023&q=' +_str;
  var headers = {
      'Authorization': 'Bearer '+ this.token
  }
  return requestGetPromise(URL, headers)
}

WIT.prototype.converse = function (_str, _sessionId, _postData) {
  var URL;

  if(!_str) {
    URL = 'https://api.wit.ai/converse?v=20160526&session_id='+_sessionId;
  }
  else{
    URL = 'https://api.wit.ai/converse?v=20160526&session_id='+_sessionId+'&q='+_str;
  }

  var headers = {
      'Authorization': 'Bearer '+ this.token,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
  }

  return requestPostPromise(URL, headers, _postData || {})
}


module.exports = WIT
