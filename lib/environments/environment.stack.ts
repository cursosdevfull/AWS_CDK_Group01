import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as path from 'path';
import { Construct } from 'constructs';

class MicroserviceApiStack extends cdk.NestedStack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new lambda.Function(this, "microservice-api", {
            functionName: "MicroserviceAPI",
            code: lambda.Code.fromAsset(path.join(__dirname, "../../functions")),
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: "microservice-api-function.handler"
        })
    }
}

class MicroserviceDatabaseStack extends cdk.NestedStack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new dynamodb.TableV2(this, "microservice-database", {
            partitionKey: {name: "pk", type: dynamodb.AttributeType.STRING},
        })
    }
}

export class EnvironmentStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new MicroserviceApiStack(this, "MicroserviceApiStack", {});
        new MicroserviceDatabaseStack(this, "MicroserviceDatabaseStack", {});
    }
}