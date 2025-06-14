import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class S3AssetsStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const codeAsset = lambda.Code.fromAsset(path.join(__dirname, "./functions"));

        new lambda.Function(this, "S3AssetFunction", {
            functionName: "S3AssetFunction",
            runtime: lambda.Runtime.NODEJS_22_X,
            code: codeAsset,
            handler: "sample01.handler",
        })
    }
}