import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class RemovalPolicyStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new s3.Bucket(this, "MyBucket", {
            versioned: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY, // This will delete the bucket when the stack is destroyed
            autoDeleteObjects: true // This will delete all objects in the bucket when the stack is destroyed
        })

    }
}