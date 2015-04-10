#!/bin/bash
zip -r ../LambdaBilling ./* -x bin/\* .env .gitignore LICENSE package.json README.md

aws lambda create-function \
--function-name LambdaBilling \
--runtime nodejs \
--role $LAMBDA_ROLE_ARN \
--handler index.handler \
--zip-file fileb://../LambdaBilling.zip \
--profile $AWS_PROFILE
