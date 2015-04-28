#!/bin/bash
aws iam attach-role-policy \
--role-name lambda-billing-execution \
--policy-arn $POLICY_ARN \
--profile $AWS_PROFILE
