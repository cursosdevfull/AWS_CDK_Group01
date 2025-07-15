import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Sqs } from './constructs/sqs';
import { DynamoDB } from './constructs/dynamodb';
import { Functions } from './constructs/functions';
import { IQueue } from 'aws-cdk-lib/aws-sqs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class LambdaSqsDlqLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { sqsMain, sqsDlq } = new Sqs(this, 'SqsConstruct');

    const { processTable, failuresTable } = new DynamoDB(this, 'DynamoDBConstruct');

    new Functions(this, 'FunctionsConstruct', {
      processTable,
      failuresTable,
      sqsMain,
      sqsDlq
    })
  }
}
