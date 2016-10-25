# wit-module

It is a customized module for wit.ai API.

[![NPM](https://nodei.co/npm/wit-module.png?downloads=true&downloadRank=true)](https://www.npmjs.com/package/wit-module)


## Install

```
$ npm install --save wit-module
```

## Usage

Initializing the wit token to process.env.WIT_TOKEN

```js
var WIT = require("wit-module")
var witModule = new WIT(process.env.WIT_TOKEN);

witModule.converse('something to say?',_sessionId ).then(function(result){

  console.log(result);

},function(err){
  console.error(err);
})

```

## Document

### converse (_str, _sessionId, _postData)
 return a promise with response body
[tutorial](http://bananajs.blogspot.tw/2016/10/wit-ai-converse_25.html)
[offical doc](https://wit.ai/docs/recipes#converse-link)
```js

WIT.prototype.converse (_str, _sessionId, _postData)

// {
//   "confidence": 0.021887092777471962,
//   "type": "action",
//   "action": "findTheater",
//   "entities": {
//     "datetime": [
//       {
//         .....
//       }
//     ],
//     "intent": [
//       {
//         "confidence": 0.9870533668643489,
//         "value": "movie"
//       }
//     ]
//   }
// }


```


## License


[MIT](http://vjpr.mit-license.org)