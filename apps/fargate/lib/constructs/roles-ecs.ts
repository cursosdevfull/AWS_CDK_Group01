import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";

export class RolesECSConstruct extends Construct {
    readonly taskRole: iam.Role;
    readonly executionRole: iam.Role;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.taskRole = new iam.Role(this, 'TaskRole', {
            assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com')
        });

        this.executionRole = new iam.Role(this, 'ExecutionRole', {
            assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com')
        });

        const policyStatement = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
            ],
            resources: ["*"]
        })

        this.executionRole.addToPolicy(policyStatement);
    }
}