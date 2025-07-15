import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Functions } from './constructs/functions';
import { Sqs } from './constructs/sqs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class LambdaSqsLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { lambda01, lambda02 } = new Functions(this, 'Functions')

    new Sqs(this, 'Queue', {
      lambda01,
      lambda02,
    })
  }
}
