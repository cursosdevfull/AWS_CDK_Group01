import { Construct } from "constructs";
import { NodejsLambda } from '../../../../libs/aws/nodejs-lambda';
import * as path from "path";
import { ITableV2 } from "aws-cdk-lib/aws-dynamodb";

type FunctionsProps = {
    table: ITableV2
}

export class Functions extends Construct {
    public readonly addLambda: NodejsLambda;
    public readonly listLambda: NodejsLambda;
    public readonly getOneLambda: NodejsLambda;
    public readonly updateLambda: NodejsLambda
    public readonly deleteLambda: NodejsLambda;

    constructor(scope: Construct, id: string, props: FunctionsProps) {
        super(scope, id);

        this.addLambda = new NodejsLambda(this, 'AddLambda', {
            functionName: "ApiGatewayStack-AddLambda",
            description: 'Add product',
            entry: path.join(__dirname, "../lambda-code/add.ts"),
            environment: {
                TABLE_NAME: props.table.tableName
            }
        })

        this.listLambda = new NodejsLambda(this, 'ListLambda', {
            functionName: "ApiGatewayStack-ListLambda",
            description: 'Product list',
            entry: path.join(__dirname, "../lambda-code/list.ts"),
            environment: {
                TABLE_NAME: props.table.tableName
            }
        })

        this.getOneLambda = new NodejsLambda(this, 'GetOneLambda', {
            functionName: "ApiGatewayStack-GetOneLambda",
            description: 'Get product by ID',
            entry: path.join(__dirname, "../lambda-code/get-one.ts"),
            environment: {
                TABLE_NAME: props.table.tableName
            }
        })

        this.updateLambda = new NodejsLambda(this, 'UpdateLambda', {
            functionName: "ApiGatewayStack-UpdateLambda",
            description: 'Update product by ID',
            entry: path.join(__dirname, "../lambda-code/update.ts"),
            environment: {
                TABLE_NAME: props.table.tableName
            }
        })

        this.deleteLambda = new NodejsLambda(this, 'DeleteLambda', {
            functionName: "ApiGatewayStack-DeleteLambda",
            description: 'Delete product by ID',
            entry: path.join(__dirname, "../lambda-code/delete.ts"),
            environment: {
                TABLE_NAME: props.table.tableName
            }
        })

        props.table.grantWriteData(this.addLambda);
        props.table.grantReadData(this.listLambda);
        props.table.grantReadData(this.getOneLambda);
        props.table.grantWriteData(this.updateLambda);
        props.table.grantWriteData(this.deleteLambda);
    }
}