#!/bin/bash
aws iam create-policy \
--policy-name LambdaBillingPolicy \
--policy-document "{
  \"Version\": \"2012-10-17\",
  \"Statement\": [
    {
      \"Sid\": \"Stmt1428698404474\",
      \"Action\": [
        \"s3:GetObject\"
      ],
      \"Effect\": \"Allow\",
      \"Resource\": \"arn:aws:s3:::$BUCKET_ARN\"
    }
  ]
}" \
--profile $AWS_PROFILE
