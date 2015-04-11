#!/bin/bash
aws dynamodb create-table \
--attribute-definitions AttributeName=Account,AttributeType=S AttributeName=Timestamp,AttributeType=S \
--table-name BillingHistory \
--key-schema AttributeName=Account,KeyType=HASH AttributeName=Timestamp,KeyType=RANGE \
--provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=5 \
--profile $AWS_PROFILE
