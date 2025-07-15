import { Construct } from "constructs";
import { NodejsLambda } from '../../../../libs/aws/nodejs-lambda';
import * as path from "path";
import { LayerVersion } from "aws-cdk-lib/aws-lambda";
import { Fn } from "aws-cdk-lib";

export class Functions extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const layerOperationsArn = Fn.importValue("MathOperationsLayerArn");

        new NodejsLambda(this, 'Lambda01', {
            functionName: 'Lambda04',
            description: 'Lambda function 01',
            entry: path.join(__dirname, "../lambda-code/lambda01.ts"),
            layers: [
                LayerVersion.fromLayerVersionArn(this, 'LayerOperations', layerOperationsArn)
            ],
        })




    }
}