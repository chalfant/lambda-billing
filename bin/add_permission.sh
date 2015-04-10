#!/bin/bash
aws lambda add-permission \
--function-name LambdaBilling \
--region us-east-1 \
--statement-id Id-LambdaBilling-AddPermission \
--action "lambda:InvokeFunction" \
--principal s3.amazonaws.com \
--source-arn "arn:aws:s3:::$BUCKET_ARN" \
--source-account $AWS_ACCOUNT_ID \
--profile $AWS_PROFILE
