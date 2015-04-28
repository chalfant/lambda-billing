lambda-billing
==============

Requires AWS Command Line Interface (http://aws.amazon.com/cli/).

Get Started
-----------

    export AWS_PROFILE="YourAwsCliProfile"
    export BUCKET="YourBillingBucketName"

    # create the dynamodb table
    bin/create_table.sh

    # create the lambda role
    bin/create_role.sh

    # create the policy to allow lambda to write to dynamodb
    export TABLE_ARN="YourDynamoDBTableArn"
    bin/create_policy.sh

    # attach the policy to the role
    export POLICY_ARN="PolicyArnCreatedByCreatePolicyScript"
    bin/attach_role_policy.sh

    # edit and upload your config
    aws s3 cp ./config/lambda-billing-config.json s3://$BUCKET/lambda-billing.config.json

    # create lambda function
    export LAMBDA_ROLE_ARN="RoleArnCreatedByCreateRoleScript"
    bin/create_function.sh

    # allow s3 to call lambda
    bin/add_permission.sh

    # configure bucket to trigger events
    export LAMBDA_FUNCTION_ARN="LambdaFunctionArnCreatedByCreateFunctionScript"
    bin/configure_bucket.sh
