import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as iam from 'aws-cdk-lib/aws-iam';


export class VpcAlbStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const vpc = new ec2.Vpc(this, "cdk-demo-vpc", {
            maxAzs: 2,
        })

        const alb = new elbv2.ApplicationLoadBalancer(this, "cdk-demo-alb", {
            vpc
        })

        const role = iam.Role.fromRoleArn(this, "cdk-demo-role", "arn:aws:iam::282865065290:role/service-role/add-new-person-role-ku6pgh8c")




        // Define your VPC and ALB resources here
        // Example: const vpc = new ec2.Vpc(this, 'MyVpc', { maxAzs: 2 });
        // Example: const alb = new elbv2.ApplicationLoadBalancer(this, 'MyAlb', { vpc, internetFacing: true });

        // Add more resources as needed
    }
}