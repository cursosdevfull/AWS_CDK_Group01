import { Duration } from "aws-cdk-lib";
import { EventSourceMapping } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs/lib/construct";

interface SqsProps {
    lambda01: NodejsFunction,
    lambda02: NodejsFunction
}

export class Sqs extends Construct {
    constructor(scope: Construct, id: string, props: SqsProps) {
        super(scope, id);

        const queue = new Queue(this, "Queue", {
            queueName: "LambdaSqsLambdaStack-Queue.fifo",
            fifo: true,
            contentBasedDeduplication: true,
            visibilityTimeout: Duration.seconds(30),
            retentionPeriod: Duration.days(1),
        })

        queue.grantSendMessages(props.lambda01);

        props.lambda01.addEnvironment("QUEUE_URL", queue.queueUrl);

        /*props.lambda02.addEventSource(new SqsEventSource(queue, {
            batchSize: 10,
        }))*/

        queue.grantConsumeMessages(props.lambda02);

        new EventSourceMapping(this, "SqsEventSourceMapping", {
            target: props.lambda02,
            eventSourceArn: queue.queueArn,
            batchSize: 10,
        })
    }
}