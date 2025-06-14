import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";

interface PermissionsStackProps extends cdk.StackProps {
    environment: {
        env: "prd" | "dev" | "test";
    };
}

export class PermissionsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: PermissionsStackProps) {
        super(scope, id, props);

        const table = new dynamodb.TableV2(this, "users", {
            partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
            tableName: "users",
            removalPolicy: props.environment.env !== "prd" ? cdk.RemovalPolicy.DESTROY : cdk.RemovalPolicy.RETAIN, // Only for dev/test environments
        })


        const codeAsset = lambda.Code.fromAsset(path.join(__dirname, "./functions"));

        const lambdaUsers = new lambda.Function(this, "S3AssetFunction", {
            runtime: lambda.Runtime.NODEJS_22_X,
            code: codeAsset,
            handler: "lambda-dynamodb.handler",
            environment: {
                env: props.environment.env,
            },
        })

        //table.grantReadWriteData(lambdaUsers);

        lambdaUsers.addToRolePolicy(
            new iam.PolicyStatement(
                {
                    actions: ["dynamodb:*"],
                    resources: [table.tableArn],
                    effect: iam.Effect.ALLOW,
                }
            )
        )

        lambdaUsers.addEnvironment("TABLE_NAME", table.tableName);
    }
}