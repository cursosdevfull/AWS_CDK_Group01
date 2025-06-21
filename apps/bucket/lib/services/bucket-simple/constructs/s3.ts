import { Construct } from "constructs";
import { Bucket, IBucket } from "aws-cdk-lib/aws-s3";
import { Names, RemovalPolicy } from "aws-cdk-lib";

export class S3Bucket extends Construct {
    readonly bucket: IBucket

    constructor(scope: Construct, id: string) {
        super(scope, id);

        const bucketName = "bucket-simple-" + Names.uniqueId(this).toLowerCase();

        this.bucket = new Bucket(this, 'BucketSimple', {
            bucketName,
            versioned: true,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        })
    }
}