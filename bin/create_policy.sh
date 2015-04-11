#!/bin/bash
aws iam create-policy \
--policy-name LambdaBillingPolicy \
--policy-document "{
  \"Version\": \"2012-10-17\",
  \"Statement\": [
    {
      \"Action\": [
        \"s3:GetObject\"
      ],
      \"Effect\": \"Allow\",
      \"Resource\": \"arn:aws:s3:::$BUCKET/*\"
    },
    {
      \"Action\": [ \"dynamodb:PutItem\" ],
      \"Effect\": \"Allow\",
      \"Resource\": \"arn:aws:dynamodb:us-east-1:$AWS_ACCOUNT_ID:table/BillingHistory\"
    }
  ]
}" \
--profile $AWS_PROFILE
