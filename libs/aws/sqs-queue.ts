import { Duration } from "aws-cdk-lib";
import { DeadLetterQueue, Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

type SqsProps = {
    queueName?: string;
    visibilityTimeout?: Duration;
    retentionPeriod?: Duration;
    deadLetterQueue?: DeadLetterQueue
}

export class SqsQueue extends Queue {
    constructor(scope: Construct, id: string, props?: SqsProps) {
        super(scope, id, {
            visibilityTimeout: Duration.seconds(30),
            retentionPeriod: Duration.days(1),
            ...props,
        });
    }
}