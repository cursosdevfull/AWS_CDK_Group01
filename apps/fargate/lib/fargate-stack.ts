import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { VpcAlbConstruct } from './constructs/vpc-alb';
import { RolesECSConstruct } from './constructs/roles-ecs';
import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';
import * as path from 'path';
import { ECSServiceConstruct } from './constructs/ecs-service';

export class FargateStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const imageAsset = new ecr_assets.DockerImageAsset(this, "image-asset", {
      directory: path.join(__dirname, "./app"),
      assetName: "app-image"
    })

    const { vpc, alb } = new VpcAlbConstruct(this, 'VpcAlbConstruct');

    const { taskRole, executionRole } = new RolesECSConstruct(this, 'RolesECSConstruct');

    new ECSServiceConstruct(this, 'ECSServiceConstruct', { vpc, alb, taskRole, executionRole, imageAsset });

  }
}
