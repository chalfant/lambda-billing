var async = require('async');
var AWS = require('aws-sdk');
var csvParse = require('csv-parse');
var util = require('util');

// config
var expectedFees = 500.0;

var s3 = new AWS.S3();

exports.handler = function(event, context) {
  //console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));
  var bucket = event.Records[0].s3.bucket.name;
  var key    = event.Records[0].s3.object.key;

  async.waterfall([
    function download(next) {
      console.log("getting " + bucket + "/" + key);
      s3.getObject({ Bucket: bucket, Key: key }, next);
    },
    function parse(response, next) {
      csvParse(response.Body, {columns: true}, function(err, data) {
        var categoryFees = [];
        data.forEach(function(row) {
          var category = row.ProductCode;
          var fees = row.TotalCost;

          if (row.ItemDescription.match(/^Total statement amount for period/)) {
            category = "Total";
          }

          if (!category) {
            return;
          }

          if (!categoryFees[category]) {
            categoryFees[category] = 0.0;
          }

          categoryFees[category] += parseFloat(fees);
        });

        if (err) {
          next(err);
        } else {
          next(null, categoryFees);
        }
      });
    },
    function writeToDynamo(data, next) {
      //console.log("parsed data:", util.inspect(data));
      var currentFees = data.Total;
      var percentOfExpected = currentFees / expectedFees * 100;
      var alertLevel = Math.floor(percentOfExpected / 25);
      var timestamp = new Date().toISOString();

      console.log("Total Fees: " + currentFees);
      console.log("POE:        " + percentOfExpected);
      console.log("Alert:      " + alertLevel);
      console.log("Timestamp:  " + timestamp);

      next(null);
    }
  ], function(err) {
    if (err) {
      console.error("Err:", err);
    } else {
      context.done();
    }
  });
};