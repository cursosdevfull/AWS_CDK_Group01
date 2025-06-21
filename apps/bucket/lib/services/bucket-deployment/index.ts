import { Stack, StackProps } from "aws-cdk-lib";


import { Construct } from "constructs";
import { S3Bucket } from './constructs/s3';
import { Functions } from './constructs/functions';


export class BucketDeployment extends Construct {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id);

    const { bucketLambdaCode } = new S3Bucket(this, "BucketCodeLambda")

    new Functions(this, "Functions", {
      bucketLambdaCode
    })
  }
}