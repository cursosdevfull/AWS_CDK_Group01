import { Stack, StackProps } from "aws-cdk-lib";

import { Construct } from "constructs";
import { S3Bucket } from "./constructs/s3";

export class BucketSimpleStack extends Construct {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id);

    const bucket = new S3Bucket(this, "BucketSimple");
  }
}