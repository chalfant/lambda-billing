var async    = require('async');
var AWS      = require('aws-sdk');
var csvParse = require('csv-parse');
var util     = require('util');

function readConfig(s3, bucket, cb) {
  var params = {
    Bucket: bucket,
    Key: "lambda-billing-config.json"
  };
  s3.getObject(params, function(err, data) {
    var results = JSON.parse(data.Body.toString());
    cb(results);
  });
}

var s3 = new AWS.S3();
var db = new AWS.DynamoDB();

exports.handler = function(event, context) {
  //console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));
  var bucket = event.Records[0].s3.bucket.name;
  var key    = event.Records[0].s3.object.key;

  async.waterfall([
    function download(next) {
      console.log("getting " + bucket + "/" + key);
      if (!key.match(/aws-billing-csv/)) {
        console.log("skipping file");
        context.succeed();
      }
      s3.getObject({ Bucket: bucket, Key: key }, next);
    },
    function parse(response, next) {
      console.log("parsing file");
      csvParse(response.Body, {columns: true}, function(err, data) {
        var categoryFees = [];
        data.forEach(function(row) {
          var category = row.ProductCode;
          var fees = row.TotalCost;

          if (row.ItemDescription && row.ItemDescription.match(/^Total statement amount for period/)) {
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
          readConfig(s3, bucket, function(data) {
            categoryFees.config = data;
            next(null, categoryFees);
          });
        }
      });
    },
    function writeToDynamo(data, next) {
      // console.log("parsed data:", util.inspect(data));
      var config = data.config;
      var currentFees = data.Total;
      var percentOfExpected = currentFees / config.expectedFees * 100;
      var alertLevel = Math.floor(percentOfExpected / 25);
      var timestamp = new Date().toISOString();

      // console.log("Total Fees: " + currentFees);
      // console.log("POE:        " + percentOfExpected);
      // console.log("Alert:      " + alertLevel);
      // console.log("Timestamp:  " + timestamp);

      // build map for categorized fees
      var categorized = {};
      Object.keys(data).forEach(function(key) {
        if (key === "config") {
          return;
        }
        categorized[key] = { N: String(data[key]) };
      });

      // setup item params
      var params = {
        Item: {
          Account: {
            S: config.awsAccountId
          },
          Timestamp: {
            S: timestamp
          },
          TotalFees: {
            N: String(currentFees)
          },
          AlertLevel: {
            N: String(alertLevel)
          },
          ExpectedFees: {
            N: String(config.expectedFees)
          },
          FeesByCategory: {
            M: categorized
          }
        },
        TableName: config.tableName,
      };

      // console.log(util.inspect(params, {depth: 5}));

      db.putItem(params, function(err, data) {
        if (err) {
          next(err);
        } else {
          next(null, data);
        }
      });
    }
  ], function(err) {
    if (err) {
      console.error("Err:", err);
      context.fail(err);
    } else {
      context.succeed();
    }
  });
};