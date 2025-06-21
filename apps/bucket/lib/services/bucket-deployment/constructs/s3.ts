import { Construct } from "constructs";
import { Bucket, IBucket } from "aws-cdk-lib/aws-s3";
import { RemovalPolicy } from "aws-cdk-lib";
import * as path from 'path';
import * as fs from 'fs';



export class S3Bucket extends Construct {
    readonly bucketLambdaCode: IBucket

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.bucketLambdaCode = new Bucket(this, 'BucketLambdaCode', {
            versioned: true,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        })
    }
}