import { StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Functions } from './constructs/functions';


export class BucketDeploymentWithoutBucket extends Construct {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id);

    new Functions(this, "Functions")
  }
}