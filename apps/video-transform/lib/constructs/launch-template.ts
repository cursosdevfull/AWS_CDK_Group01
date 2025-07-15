import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import { IQueue } from "aws-cdk-lib/aws-sqs";
import { IBucket } from "aws-cdk-lib/aws-s3";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";

interface LaunchTemplateConstructProps {
    vpc: ec2.Vpc;
    securityGroup: ec2.SecurityGroup;
    roleEC2: iam.Role;
    queue: IQueue;
    bucketInput: IBucket;
    bucketOutput: IBucket;
    imageAsset: DockerImageAsset;
}

export class LaunchTemplateConstruct extends Construct {
    readonly launchTemplate: ec2.LaunchTemplate;

    constructor(
        scope: Construct,
        id: string,
        props: LaunchTemplateConstructProps
    ) {
        super(scope, id);

        this.launchTemplate = new ec2.LaunchTemplate(this, "LaunchTemplate", {
            instanceType: new ec2.InstanceType("t3.medium"),
            machineImage: ec2.MachineImage.latestAmazonLinux2023(),
            securityGroup: props.securityGroup,
            spotOptions: {
                requestType: ec2.SpotRequestType.ONE_TIME,
            },
            role: props.roleEC2,
            userData: ec2.UserData.custom(`
#!/bin/bash
yum update -y
yum install docker -y
yum install aws-cli -y
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

aws ecr get-login-password | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.ecr.us-east-1.amazonaws.com

docker run --rm \
    -e QUEUE_URL=${props.queue.queueUrl} \
    -e VIDEO_BUCKET_INPUT=${props.bucketInput.bucketName} \
    -e VIDEO_BUCKET_OUTPUT=${props.bucketOutput.bucketName} \
    ${props.imageAsset.imageUri} 
            `),
        });
    }
}
