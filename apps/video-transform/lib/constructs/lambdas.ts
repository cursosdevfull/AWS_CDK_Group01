import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";
import * as cdk from 'aws-cdk-lib';
import { IQueue } from "aws-cdk-lib/aws-sqs";
import { IBucket } from "aws-cdk-lib/aws-s3";
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as iam from 'aws-cdk-lib/aws-iam';

interface LambdasConstructProps {
    queue: IQueue
    bucketInput: IBucket
    subnetId: string;
    securityGroupId: string;
    launchTemplateId: string;
    roleEC2: iam.IRole;
}


export class LambdasConstruct extends Construct {
    public readonly lambdaNotify: NodejsFunction;
    public readonly lambdaStarter: NodejsFunction;

    constructor(scope: Construct, id: string, props: LambdasConstructProps) {
        super(scope, id);

        this.lambdaNotify = new NodejsFunction(this, 'LambdaNotify', {
            functionName: 'lambda-notify',
            runtime: Runtime.NODEJS_20_X,
            entry: path.join(__dirname, "../code/lambda-notify.ts"),
            timeout: cdk.Duration.minutes(1),
            environment: {
                QUEUE_URL: props.queue.queueUrl
            }
        })

        props.queue.grantSendMessages(this.lambdaNotify);

        props.bucketInput.addEventNotification(
            s3.EventType.OBJECT_CREATED,
            new s3n.LambdaDestination(this.lambdaNotify),
            { suffix: '.mp4' }
        );

        this.lambdaStarter = new NodejsFunction(this, 'LambdaStarter', {
            functionName: 'lambda-starter',
            runtime: Runtime.NODEJS_20_X,
            entry: path.join(__dirname, "../code/lambda-starter.ts"),
            timeout: cdk.Duration.minutes(1),
            environment: {
                SUBNET_ID: props.subnetId,
                SECURITY_GROUP_ID: props.securityGroupId,
                LAUNCH_TEMPLATE_ID: props.launchTemplateId
            }
        })

        this.lambdaStarter.addToRolePolicy(
            new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: [
                    'ec2:RunInstances',
                    'ec2:TerminateInstances',
                    'ec2:DescribeInstances',
                    'ec2:DescribeLaunchTemplates',
                    'ec2:CreateTags',
                    "ec2:DescribeSubnets",
                    "ec2:DescribeSecurityGroups"
                ],
                resources: ['*'],
            })
        )

        this.lambdaStarter.addToRolePolicy(
            new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: [
                    "iam:PassRole"
                ],
                resources: [props.roleEC2.roleArn],
            })
        )
    }
}