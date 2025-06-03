import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import { Construct } from 'constructs';
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class ConstructStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps){
        super(scope, id, props)
        this.generateConstructL1();
        this.generateConstructL2();
        this.generateConstructL3();
    }

    private generateConstructL1() {
        // Role for the L1 construct
        const sampleCfnRole = new iam.CfnRole(this, "sample-l1-role", {
            assumeRolePolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Action: "sts:AssumeRole",
                        Principal: {
                            Service: "lambda.amazonaws.com"
                        }
                    }
                ]
            },
            description: "Sample L1 Construct Role",
            managedPolicyArns: ["arn:aws:iam::aws:policy/AWSLambdaExecute"],
            roleName: "SampleL1Role"
        })

        // Asset for the source code of the L1 construct
        const sourceCode = new Asset(this, "source-code-l1", {
            path: path.join(__dirname, "../../functions")
        })

        new lambda.CfnFunction(this, "sample-l1-function", {
            functionName: "SampleL1Function",
            code: {
                s3Bucket: sourceCode.s3BucketName,
                s3Key: sourceCode.s3ObjectKey
            },
            runtime: "nodejs20.x",
            handler: "sample-li-function.handler",
            role: sampleCfnRole.attrArn
        })
    }

    private generateConstructL2() {
        new lambda.Function(this, "sample-l2-function", {
            functionName: "SampleL2Function",
            code: lambda.Code.fromAsset(path.join(__dirname, "../../functions")),
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: "sample-l2-function.handler"
        })
    }

    private generateConstructL3() {
        new apigateway.LambdaRestApi(this, "sample-l3-api", {
            handler: new lambda.Function(this, "sample-l3-function", {
                functionName: "SampleL3Function",
                code: lambda.Code.fromAsset(path.join(__dirname, "../../functions")),
                runtime: lambda.Runtime.NODEJS_20_X,
                handler: "sample-l3-function.handler"
            }),
            proxy: true
        })
    }
}