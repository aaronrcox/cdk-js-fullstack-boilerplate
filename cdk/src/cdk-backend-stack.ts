
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class CdkBackendStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const hello = new lambda.Function(this, 'NestJsBackendApi', {
            runtime: lambda.Runtime.NODEJS_14_X,    // execution environment
            code: lambda.Code.fromAsset('nest-js-backend-api/dist'),  // code loaded from "lambda" directory
            handler: 'main.handler'                // file is "main", function is "handler"
        });

    }
}
