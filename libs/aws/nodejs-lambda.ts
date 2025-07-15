import { Duration } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

interface NodejsLambdaProps extends Omit<NodejsFunctionProps, "code"> {
    entry: string; // Path to the entry file
}

export class NodejsLambda extends NodejsFunction {
    constructor(scope: Construct, id: string, props: NodejsLambdaProps) {
        super(scope, id, {
            ...props,
            handler: props.handler || 'handler', // Default handler function
            runtime: props.runtime || Runtime.NODEJS_22_X,
            timeout: props.timeout || Duration.minutes(10),
            memorySize: props.memorySize || 512,
            bundling: {
                minify: true,
                sourceMap: true,
                externalModules: ['aws-sdk', 'math-operations'], // Exclude aws-sdk from the bundle
            },
            logRetention: props.logRetention || RetentionDays.ONE_WEEK
        });
    }
}