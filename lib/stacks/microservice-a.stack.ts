import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class MicroserviceAStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new lambda.Function(this, "microservice-a-function", {
            functionName: "MicroserviceAFunction",
            code: lambda.Code.fromAsset(path.join(__dirname, "../../functions")),
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: "microservice-a-function.handler"
        })

    }
}