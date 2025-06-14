import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class TagsDemo01Stack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new dynamodb.TableV2(this, "todo-db", {
            partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
        })

        new lambda.Function(this, "microservice-b-function", {
            functionName: "MicroserviceBFunction",
            code: lambda.Code.fromAsset(path.join(__dirname, "./functions")),
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: "todo-service.handler"
        })

        cdk.Tags.of(this).add("Area", "TI")
        cdk.Tags.of(this).add("Environment", "Development");
        cdk.Tags.of(this).add("Project", "CDK-Demo");
        cdk.Tags.of(this).add("Owner", "John Doe");
        cdk.Tags.of(this).add("CostCenter", "CC1234");

    }
}


export class TagsDemo02Stack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new dynamodb.TableV2(this, "todo-db", {
            partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
        })

        const todo_service = new lambda.Function(this, "todo-service", {
            functionName: "MicroserviceAFunction",
            code: lambda.Code.fromAsset(path.join(__dirname, "./functions")),
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: "todo-service.handler"
        })

        cdk.Tags.of(todo_service).add("LambdaFunction", "TodoService");
    }
}

