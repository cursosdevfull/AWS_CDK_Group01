import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';
import { Construct } from 'constructs';
import * as path from 'path';

export class AssetsConstruct extends Construct {
    readonly imageAsset: ecr_assets.DockerImageAsset;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.imageAsset = new ecr_assets.DockerImageAsset(this, "video-asset", {
            directory: path.join(__dirname, "../app"),
            assetName: "video-image"
        })
    }
}