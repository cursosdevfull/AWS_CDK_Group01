import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";

export class BucketsConstruct extends Construct {
    readonly videoBucketInput: s3.Bucket;
    readonly videoBucketOutput: s3.Bucket;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.videoBucketInput = new s3.Bucket(this, 'VideoBucketInput', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            versioned: true,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        });

        this.videoBucketOutput = new s3.Bucket(this, 'VideoBucketOutput', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            versioned: true,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        });
    }
}