var async = require('async');
var AWS = require('aws-sdk');
var parse = require('csv-parse');
var util = require('util');

// config


var s3 = new AWS.S3();

exports.handler = function(event, context) {
  console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));
  var bucket = event.Records[0].s3.bucket.name;
  var key    = event.Records[0].s3.object.key;
  console.log("Bucket:", bucket);
  console.log("Key:", key);

  context.done();
};