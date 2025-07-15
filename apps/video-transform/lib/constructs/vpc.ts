import { Construct } from "constructs";
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class VpcConstruct extends Construct {
    readonly vpc: ec2.Vpc;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.vpc = new ec2.Vpc(this, "CursosDev-Vpc", {
            maxAzs: 3,
            natGateways: 1,
            ipAddresses: ec2.IpAddresses.cidr("10.0.0.0/16")
        })
    }
}