import { Construct } from "constructs";
import * as path from "path";
import { NodejsLambda } from '../../../../../../libs/aws/nodejs-lambda';

export class Functions extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);
        /* 
                const commonProps = {
                    runtime: lambda.Runtime.NODEJS_22_X,
                    timeout: Duration.minutes(10),
                    memorySize: 512,
                    bundling: {
                        minify: true,
                        sourceMap: true,
                        externalModules: ["aws-sdk"], // Exclude aws-sdk from the bundle
                    },
                    logRetention: RetentionDays.ONE_WEEK,
                }; */

        new NodejsLambda(this, "Lambda1", {
            description: "Lambda function 1",
            entry: path.join(__dirname, "../lambda-code/lambda1/lambda1.ts"),
            handler: "handler",
        });

        new NodejsLambda(this, "Lambda2", {
            description: "Lambda function 2",
            entry: path.join(__dirname, "../lambda-code/lambda2/lambda2.ts"),
            handler: "handler",
        });

        new NodejsLambda(this, "Lambda3", {
            description: "Lambda function 3",
            entry: path.join(__dirname, "../lambda-code/lambda3/lambda3.ts"),
            handler: "handler",
        });

        /* const lambda1 = new nodejs.NodejsFunction(this, 'Lambda1', {
                description: 'Lambda function 1',
                entry: path.join(__dirname, '../lambda-code/lambda1/lambda1.ts'),
                handler: 'handler',
                ...commonProps
            })
    
            const lambda2 = new nodejs.NodejsFunction(this, 'Lambda2', {
                description: 'Lambda function 2',
                entry: path.join(__dirname, '../lambda-code/lambda2/lambda2.ts'),
                handler: 'handler',
                ...commonProps
            })
    
            const lambda3 = new nodejs.NodejsFunction(this, 'Lambda3', {
                description: 'Lambda function 3',
                entry: path.join(__dirname, '../lambda-code/lambda3/lambda3.ts'),
                handler: 'handler',
                ...commonProps
            }) */
    }
}
