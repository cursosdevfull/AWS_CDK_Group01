import * as cdk from 'aws-cdk-lib';
import { BucketSimpleStack } from './services/bucket-simple';
import { BucketDeployment } from './services/bucket-deployment/index';
import { BucketDeploymentWithoutBucket } from './services/bucket-deployment-without-bucket';



export class BucketStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new BucketSimpleStack(this, 'BucketSimpleStack');

    new BucketDeployment(this, 'BucketDeploymentStack')

    new BucketDeploymentWithoutBucket(this, 'BucketDeploymentWithoutBucketStack');
  }
}