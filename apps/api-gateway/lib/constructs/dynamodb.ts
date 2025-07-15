import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, TableV2 } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class DynamoDB extends Construct {
    readonly table: TableV2;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.table = new TableV2(this, "ProductsTable", {
            partitionKey: {
                name: "productId",
                type: AttributeType.STRING
            },
            tableName: "products",
            removalPolicy: RemovalPolicy.DESTROY
        })
    }
}