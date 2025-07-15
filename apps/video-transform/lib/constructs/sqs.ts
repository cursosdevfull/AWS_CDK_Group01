import { Construct } from "constructs";
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';

export class SQSConstruct extends Construct {
    readonly videoQueue: sqs.Queue;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.videoQueue = new sqs.Queue(this, 'VideoQueue', {
            queueName: 'video-transform-queue',
            visibilityTimeout: cdk.Duration.minutes(60),
            retentionPeriod: cdk.Duration.days(4)
        });
    }
}