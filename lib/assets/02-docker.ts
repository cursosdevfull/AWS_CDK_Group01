import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';
import * as path from 'path';

export class DockerAssetsStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const taskDefinition = new ecs.FargateTaskDefinition(this, "todo-task-definition", {
            memoryLimitMiB: 1024,
            cpu: 512,
        })

        const imageAsset = new ecr_assets.DockerImageAsset(this, "todo-image-asset", {
            directory: path.join(__dirname, "./sample-app"),
            assetName: "todo-app-image"
        })

        taskDefinition.addContainer("todo-container", {
            image: ecs.ContainerImage.fromDockerImageAsset(imageAsset)
        })

    }
}