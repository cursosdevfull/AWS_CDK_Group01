import { Construct } from "constructs";
import { NodejsLambda } from '../../../../libs/aws/nodejs-lambda';
import * as path from "path";
import { ITableV2 } from "aws-cdk-lib/aws-dynamodb";
import { IGrantable } from "aws-cdk-lib/aws-iam";
import { IQueue } from "aws-cdk-lib/aws-sqs";
import { SqsQueue } from "aws-cdk-lib/aws-events-targets";

type FunctionsProps = {
    processTable: ITableV2,
    failuresTable: ITableV2
    sqsMain: SqsQueue,
    sqsDlq: SqsQueue
}

export class Functions extends Construct {
    public readonly processLambda: NodejsLambda;

    constructor(scope: Construct, id: string, props: FunctionsProps) {
        super(scope, id);

        const initLambda = new NodejsLambda(this, 'InitLambda', {
            functionName: "InitLambda",
            entry: path.join(__dirname, "../lambda-code/lambda-init.ts")
        })

        const processLambda = new NodejsLambda(this, 'ProcessLambda', {
            functionName: "Process Lambda",
            description: 'Process SQS messages',
            entry: path.join(__dirname, "../lambda-code/lambda-process.ts"),
            environment: {
                TABLE_NAME: props.processTable.tableName
            }
        })

        const dlqLambda = new NodejsLambda(this, 'DlqLambda', {
            functionName: "DqlLambda",
            entry: path.join(__dirname, "../lambda-code/lambda-dlq.ts"),
            environment: {
                TABLE_NAME: props.failuresTable.tableName
            }
        })

        props.processTable.grantReadWriteData(processLambda as unknown as IGrantable);
        props.failuresTable.grantReadWriteData(dlqLambda as unknown as IGrantable);

        props.sqsMain.queue.grantSendMessages(initLambda as unknown as IGrantable);
        props.sqsMain.queue.grantConsumeMessages(processLambda as unknown as IGrantable);
        props.sqsDlq.queue.grantConsumeMessages(dlqLambda as unknown as IGrantable);
    }
}