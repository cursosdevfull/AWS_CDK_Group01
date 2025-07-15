import { Construct } from "constructs";
import { NodejsLambda } from '../../../../libs/aws/nodejs-lambda';
import * as path from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class Functions extends Construct {
    public readonly lambda01: NodejsFunction;
    public readonly lambda02: NodejsFunction;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.lambda02 = new NodejsFunction(this, 'Lambda02', {
            functionName: "LambdaSqsLambdaStack-Lambda02",
            description: 'Lambda function 02',
            entry: path.join(__dirname, "../lambda-code/lambda02.ts"),
        })

        this.lambda01 = new NodejsFunction(this, 'Lambda01', {
            functionName: "LambdaSqsLambdaStack-Lambda01",
            description: 'Lambda function 01',
            entry: path.join(__dirname, "../lambda-code/lambda01.ts"),
        })
    }
}