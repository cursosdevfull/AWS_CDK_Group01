import { Construct } from "constructs";
import { NodejsLambda } from '../../../../libs/aws/nodejs-lambda';
import { Code } from "aws-cdk-lib/aws-lambda";
import { Layer } from '../../../../libs/aws/layer-version';
import * as path from "path";
import { CfnOutput } from "aws-cdk-lib";

export class Functions extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const layerOperations = new Layer(this, 'LayerOperations', {
            layerVersionName: 'MathOperationsLayer',
            code: Code.fromAsset(path.join(__dirname, "../lambda-layer")),
            description: 'A layer containing math operations functions',
        })

        const lambda01 = new NodejsLambda(this, 'Lambda01', {
            functionName: 'Lambda01',
            description: 'Lambda function 01',
            entry: path.join(__dirname, "../lambda-code/lambda01.ts"),
            layers: [layerOperations],
        })

        const lambda02 = new NodejsLambda(this, 'Lambda02', {
            functionName: 'Lambda02',
            description: 'Lambda function 02',
            entry: path.join(__dirname, "../lambda-code/lambda02.ts"),
            layers: [layerOperations],
        })

        const lambda03 = new NodejsLambda(this, 'Lambda03', {
            functionName: 'Lambda03',
            description: 'Lambda function 03',
            entry: path.join(__dirname, "../lambda-code/lambda03.ts"),
            layers: [layerOperations],
        })

        new CfnOutput(this, "LayerVersionArn", {
            value: layerOperations.layerVersionArn,
            description: "The ARN of the MathOperationsLayer",
            exportName: "MathOperationsLayerArn"
        })



    }
}