import { Construct } from "constructs";
import { NodejsLambda } from '../../../../libs/aws/nodejs-lambda';
import * as path from "path";
import { CfnOutput } from "aws-cdk-lib";

export class Functions extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const lambda02 = new NodejsLambda(this, 'Lambda02', {
            functionName: "LambdaInvokeLambdaStack-Lambda02",
            description: 'Lambda function 02',
            entry: path.join(__dirname, "../lambda-code/lambda02.ts"),
        })

        const lambda01 = new NodejsLambda(this, 'Lambda01', {
            functionName: "LambdaInvokeLambdaStack-Lambda01",
            description: 'Lambda function 01',
            entry: path.join(__dirname, "../lambda-code/lambda01.ts"),
            environment: {
                TARGET_LAMBDA_ARN: lambda02.functionArn,
                TARGET_LAMBDA_NAME: lambda02.functionName,
            },
        })


        lambda02.grantInvoke(lambda01);



    }
}