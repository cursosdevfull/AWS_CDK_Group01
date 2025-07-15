import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { AssetsConstruct } from "./constructs/assets";
import { BucketsConstruct } from "./constructs/buckets";
import { SQSConstruct } from "./constructs/sqs";
import { LambdasConstruct } from "./constructs/lambdas";
import { RolesEC2Construct } from "./constructs/roles-ec2";
import { LaunchTemplateConstruct } from "./constructs/launch-template";
import { VpcConstruct } from "./constructs/vpc";
import { SecurityGroupConstruct } from "./constructs/security-group";

export class VideoTransformStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { imageAsset } = new AssetsConstruct(this, "AssetsConstruct");

    const { videoBucketInput, videoBucketOutput } = new BucketsConstruct(
      this,
      "BucketsConstruct"
    );

    const { videoQueue } = new SQSConstruct(this, "SQSConstruct");

    const { vpc } = new VpcConstruct(this, "VpcConstruct");

    const { securityGroup } = new SecurityGroupConstruct(this, "SecurityGroupConstruct", { vpc })

    const { roleEC2 } = new RolesEC2Construct(this, "RolesEC2Construct", {
      videoBucketInput,
      videoBucketOutput,
      videoQueue,
    });

    const { launchTemplate } = new LaunchTemplateConstruct(
      this,
      "LaunchTemplateConstruct",
      {
        vpc,
        securityGroup,
        roleEC2,
        queue: videoQueue,
        bucketInput: videoBucketInput,
        bucketOutput: videoBucketOutput,
        imageAsset,
      }
    );

    const { lambdaNotify } = new LambdasConstruct(this, "LambdasConstruct", {
      queue: videoQueue,
      bucketInput: videoBucketInput,
      subnetId: vpc.privateSubnets[0].subnetId,
      securityGroupId: securityGroup.securityGroupId,
      launchTemplateId: launchTemplate.launchTemplateId!,
      roleEC2
    });
  }
}
