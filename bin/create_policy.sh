#!/bin/bash
aws iam create-policy \
--policy-name LambdaBillingPolicy \
--policy-document '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::'$BUCKET'/*"
    },
    {
      "Action": [ "dynamodb:PutItem" ],
      "Effect": "Allow",
      "Resource": "'$TABLE_ARN'"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}' \
--profile $AWS_PROFILE
