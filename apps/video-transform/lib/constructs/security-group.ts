import { Construct } from "constructs";
import * as ec2 from 'aws-cdk-lib/aws-ec2';

interface SecurityGroupConstructProps {
    vpc: ec2.Vpc;
}

export class SecurityGroupConstruct extends Construct {
    securityGroup: ec2.SecurityGroup;

    constructor(scope: Construct, id: string, props: SecurityGroupConstructProps) {
        super(scope, id);

        this.securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
            vpc: props.vpc,
            allowAllOutbound: true,
            description: 'Security group for video transform service'
        });
    }
}