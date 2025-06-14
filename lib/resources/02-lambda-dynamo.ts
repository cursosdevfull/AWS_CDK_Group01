import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class DynamoStack extends cdk.Stack {
    readonly table: dynamodb.TableV2;

    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.table = new dynamodb.TableV2(this, "microservice-database", {
            partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
        })
    }
}

export interface LambdaStackProps extends cdk.StackProps {
    table: dynamodb.ITable;
}

export class LambdaStack extends cdk.Stack {
    readonly lambda: lambda.Function;

    constructor(scope: cdk.App, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        this.lambda = new lambda.Function(this, "microservice-api", {
            functionName: "MicroserviceAPI",
            code: lambda.Code.fromAsset(path.join(__dirname, "./functions")),
            runtime: lambda.Runtime.NODEJS_22_X,
            handler: "getData.handler",
            environment: {
                TABLE_NAME: props.table.tableName,
            },
        })
    }
}

export class LambdaDynamoStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const { table } = new DynamoStack(scope, "DynamoStack");
        const { lambda } = new LambdaStack(scope, "LambdaStack", { table })

        table.grantReadData(lambda);

        /*         const dynamoStack = new DynamoStack(scope, "DynamoStack");
                const lambdaStack = new LambdaStack(scope, "LambdaStack", { table: dynamoStack.table });
        
                dynamoStack.table.grantReadData(lambdaStack.lambda) */

    }
}


