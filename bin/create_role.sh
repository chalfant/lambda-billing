#!/bin/bash
aws iam create-role \
--role-name lambda-billing-execution \
--assume-role-policy-document '{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "",
          "Effect": "Allow",
          "Principal": {
            "Service": "lambda.amazonaws.com"
          },
          "Action": "sts:AssumeRole"
        }
      ]
    }' \
--output text \
--query 'Role.Arn' \
--profile $AWS_PROFILE
