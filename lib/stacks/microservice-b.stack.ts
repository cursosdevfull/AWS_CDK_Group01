import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class MicroserviceBStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new lambda.Function(this, "microservice-b-function", {
            functionName: "MicroserviceBFunction",
            code: lambda.Code.fromAsset(path.join(__dirname, "../../functions")),
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: "microservice-b-function.handler"
        })

    }
}