#!/bin/bash
aws iam attach-role-policy \
--role-name lambda-billing-execution \
--policy-arn $POLICY \
--profile $AWS_PROFILE
