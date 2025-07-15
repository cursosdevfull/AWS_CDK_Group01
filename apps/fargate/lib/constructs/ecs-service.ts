import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as cdk from 'aws-cdk-lib';
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";

interface ECSServiceProps {
    vpc: ec2.Vpc;
    alb: elbv2.ApplicationLoadBalancer;
    taskRole: iam.Role;
    executionRole: iam.Role;
    imageAsset: ecr_assets.DockerImageAsset;
}

export class ECSServiceConstruct extends Construct {
    constructor(scope: Construct, id: string, props: ECSServiceProps) {
        super(scope, id);

        const { vpc, alb, taskRole, executionRole, imageAsset } = props;

        const cluster = new ecs.Cluster(this, "ECSCluster", {
            vpc, clusterName: "CursosDev-Cluster"
        })

        const taskDefinition = new ecs.FargateTaskDefinition(this, "TaskDefinition", {
            taskRole,
            executionRole
        })

        const container = new ecs.ContainerDefinition(this, "ContainerDefinition", {
            cpu: 256,
            memoryLimitMiB: 512,
            image: ecs.ContainerImage.fromDockerImageAsset(imageAsset),
            taskDefinition,
            environment: {
                NODE_ENV: "production",
                PORT: "80"
            },
            healthCheck: {
                command: ["CMD-SHELL", "curl -f http://localhost/ || exit 1"],
                interval: cdk.Duration.seconds(30),
                timeout: cdk.Duration.seconds(5),
                retries: 3,
                startPeriod: cdk.Duration.seconds(10)
            },
            logging: ecs.LogDrivers.awsLogs({
                streamPrefix: "CursosDev",
                logGroup: new cdk.aws_logs.LogGroup(this, "LogGroup", {
                    logGroupName: "/ecs/cursosdev",
                    removalPolicy: cdk.RemovalPolicy.DESTROY,
                    retention: cdk.aws_logs.RetentionDays.ONE_WEEK
                })
            })
        })

        container.addPortMappings({
            containerPort: 80,
            protocol: ecs.Protocol.TCP
        })

        const serviceFargate = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "FargateService", {
            desiredCount: 1,
            listenerPort: 80,
            loadBalancer: alb,
            cluster,
            taskDefinition,
            publicLoadBalancer: true,
            serviceName: "CursosDev-Service"
        })

        const cfnService = serviceFargate.service.node.defaultChild as ecs.CfnService;
        cfnService.deploymentConfiguration = {
            minimumHealthyPercent: 100,
            maximumPercent: 200
        };

        const scaling = serviceFargate.service.autoScaleTaskCount({
            maxCapacity: 5
        })

        scaling.scaleOnCpuUtilization("CpuScaling", {
            targetUtilizationPercent: 50,
            scaleInCooldown: cdk.Duration.seconds(60),
            scaleOutCooldown: cdk.Duration.seconds(60)
        });

        new cdk.CfnOutput(this, "LoadBalancerDNS", {
            value: serviceFargate.loadBalancer.loadBalancerDnsName,
            exportName: "LoadBalancerDNS"
        });

    }

}