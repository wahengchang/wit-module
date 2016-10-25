
var should = require('should');
var _ = require('lodash');

var WIT = require('../index.js')


var timeStamp = function() {
  return new Date().getTime();
};

var extractMovieEntities = function(result, entitiest) {
    return new Promise(function(resolve, reject) {

        var _entities = entitiest || {}

        if (result.entities) {
            var hasDateTime = false;

            _.each(result.entities, function(val, key) {
                var _val;

                if (val[0].value) {
                    _val = val[0].value;
                } else if (val[0].values) {
                    _val = val[0].values[0].value;
                }

                if (key == 'datetime') {
                    hasDateTime = true;
                    _entities['showTime'] = _val;
                } else {
                    _entities[key] = _val;
                }
            })
        }


        if (result.msg && result.msg == "Do you have time in mind?") {
            delete _entities.missingTime;
            hasDateTime = true
            // _entities['showTime'] = new Date();
        }

        if (!hasDateTime) {
            _entities['missingTime'] = true
        }

        if (result.action) {
            WIT[result.action](result.entities).then(function(result) {
                _theater = result;
                _entities.theater = _theater;
                resolve(_entities);
            })
        } else {
            resolve(_entities);
        }
    })
}

describe('Test wit.converse API, happy path', function() {
  this.timeout(50000);

  var witModule = new WIT(process.env.WIT_TOKEN);
  var _sessionId = timeStamp();
  var _theater ='';
  var _entities = {};

  it('converse, happy path: has movie, has time, 1st request', function(done) {
    witModule.converse('Where can I see Zootopia tomorrow at 6pm?',_sessionId ).then(function(result){

      return extractMovieEntities (result)
    }).then(function(entitiest){

      _entities = entitiest
      done();

    },function(err){
      done('err: ', err);
    })
  });

  it('converse, happy path: has movie, has time, 2nd request', function(done) {
    witModule.converse(null, _sessionId,  _entities).then(function(result){

      result.type.should.be.eql('msg')
      done();
    },function(err){
      done('err: ', err);
    })
  });
})

describe('Test wit.converse API, slot base', function() {
  this.timeout(50000);

  var witModule = new WIT(process.env.WIT_TOKEN);
  var _sessionId = timeStamp();
  var _entities = {};

  it('converse, slot base: send Where can I see Zootopia? response action,   1st request', function(done) {

    witModule.converse('Where can I see Zootopia?', _sessionId).then(function(result){

      result.type.should.be.eql('action');
      
      return extractMovieEntities (result)

    }).then(function(entitiest){

      _entities = entitiest

      done();
    },function(err){
      done('err: ', err);
    })
  });

  it('converse, slot base: send context result, response msg,                2nd request', function(done) {

    witModule.converse(null , _sessionId, _entities).then(function(result){

      result.type.should.be.eql('msg');

      return extractMovieEntities (result, _entities)

    }).then(function(entitiest){

      _entities = entitiest

      done();

    },function(err){
      console.log('err: ', err)
      done('err: ', err);
    })
  });

  it('converse, slot base: send tomorrow at 4pm, response action request,    3rd request', function(done) {
    witModule.converse('tomorrow at 4pm' , _sessionId, {}).then(function(result){

      result.type.should.be.eql('action');

      return extractMovieEntities (result, _entities)

    }).then(function(entitiest){

      _entities = entitiest

      done();
    },function(err){
      console.log('err: ', err)
      done('err: ', err);
    })
  });


  it('converse, slot base: send context, response final msg,                  4th request', function(done) {

    witModule.converse(null, _sessionId, _entities).then(function(result){

      result.type.should.be.eql('msg');

      done();
    },function(err){
      console.log('err: ', err)
      done('err: ', err);
    })
  });
});