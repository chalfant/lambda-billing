#!/bin/bash
aws s3api put-bucket-notification-configuration \
--bucket $BUCKET \
--notification-configuration '{
  "LambdaFunctionConfigurations": [
    {
      "LambdaFunctionArn": "'$LAMBDA_FUNCTION_ARN'",
      "Events": ["s3:ObjectCreated:*"]
    }
  ]
}' \
--profile $AWS_PROFILE
