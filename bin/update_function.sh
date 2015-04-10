#!/bin/bash
zip -r ../LambdaBilling ./* -x bin/\* .env .gitignore LICENSE package.json README.md

aws lambda update-function-code \
--function-name LambdaBilling \
--zip-file fileb://../LambdaBilling.zip \
--profile $AWS_PROFILE

rm ../LambdaBilling.zip
