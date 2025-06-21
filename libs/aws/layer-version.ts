import { LayerVersion, LayerVersionProps, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class Layer extends LayerVersion {
    constructor(scope: Construct, id: string, props: LayerVersionProps) {
        super(scope, id, {
            ...props,
            compatibleRuntimes: [Runtime.NODEJS_22_X],
        });
    }
}