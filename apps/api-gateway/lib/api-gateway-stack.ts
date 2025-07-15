import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Functions } from './constructs/functions';
import { ApiGateway } from './constructs/gateway';
import { DynamoDB } from './constructs/dynamodb';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { table } = new DynamoDB(this, 'Tables');

    const functions = new Functions(this, 'Functions', {
      table
    });

    const apiGateway = new ApiGateway(this, 'ApiGateway', {
      add: functions.addLambda,
      list: functions.listLambda,
      getOne: functions.getOneLambda,
      update: functions.updateLambda,
      delete: functions.deleteLambda,
    });
  }
}
