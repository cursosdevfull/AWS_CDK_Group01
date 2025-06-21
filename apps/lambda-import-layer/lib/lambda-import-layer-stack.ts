import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Functions } from './constructs/functions';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class LambdaImportLayerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new Functions(this, 'Functions');
  }
}
