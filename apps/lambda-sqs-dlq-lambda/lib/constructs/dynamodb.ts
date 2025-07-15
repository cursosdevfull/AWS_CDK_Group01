import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, TableV2 } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class DynamoDB extends Construct {
    readonly processTable: TableV2;
    readonly failuresTable: TableV2;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.processTable = new TableV2(this, 'ProcessTable', {
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            },
            tableName: 'processes',
            removalPolicy: RemovalPolicy.DESTROY
        })

        this.failuresTable = new TableV2(this, 'FailuresTable', {
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            },
            tableName: 'failures',
            removalPolicy: RemovalPolicy.DESTROY
        })

    }
}