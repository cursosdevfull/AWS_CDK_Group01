import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";

export class VpcAlbConstruct extends Construct {
    readonly vpc: ec2.Vpc;
    readonly alb: elbv2.ApplicationLoadBalancer;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.vpc = new ec2.Vpc(this, "CursosDev-Vpc", {
            maxAzs: 3,
            natGateways: 1,
            ipAddresses: ec2.IpAddresses.cidr("10.0.0.0/16")
        })

        this.alb = new elbv2.ApplicationLoadBalancer(this, "CursosDev-Alb", {
            vpc: this.vpc,
            internetFacing: true,
            vpcSubnets: { subnets: this.vpc.publicSubnets }
        })
    }
} 