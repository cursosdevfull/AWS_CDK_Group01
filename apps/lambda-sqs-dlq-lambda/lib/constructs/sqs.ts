import { Construct } from "constructs";
import { SqsQueue } from '../../../../libs/aws/sqs-queue';

export class Sqs extends Construct {
    readonly sqsMain: SqsQueue;
    readonly sqsDlq: SqsQueue;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.sqsDlq = new SqsQueue(this, 'SqsDlq', { queueName: "error-messages-queue" })

        this.sqsMain = new SqsQueue(this, 'SqsMain', {
            queueName: "main-messages-queue",
            deadLetterQueue: {
                queue: this.sqsDlq,
                maxReceiveCount: 1
            }
        });
    }
}