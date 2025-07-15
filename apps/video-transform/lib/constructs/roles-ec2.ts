import { Construct } from "constructs";
import * as iam from 'aws-cdk-lib/aws-iam';
import { IBucket } from "aws-cdk-lib/aws-s3";
import { IQueue } from "aws-cdk-lib/aws-sqs";

interface RolesEC2ConstructProps {
    videoBucketInput: IBucket
    videoBucketOutput: IBucket;
    videoQueue: IQueue;
}

export class RolesEC2Construct extends Construct {
    readonly roleEC2: iam.Role;

    constructor(scope: Construct, id: string, props: RolesEC2ConstructProps) {
        super(scope, id);

        // Crear el role para EC2
        this.roleEC2 = new iam.Role(this, 'EC2Role', {
            assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
            description: 'IAM role for EC2 instances to access ECR, S3 buckets and SQS queue',
        });

        // Permisos totales para ECR
        this.roleEC2.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                'ecr:*'
            ],
            resources: ['*']
        }));

        // Permisos para los buckets de S3 (leer, escribir, eliminar objetos y ListBucket)
        this.roleEC2.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                's3:GetObject',
                's3:PutObject',
                's3:DeleteObject',
                's3:GetObjectVersion',
                's3:DeleteObjectVersion'
            ],
            resources: [
                `${props.videoBucketInput.bucketArn}/*`,
                `${props.videoBucketOutput.bucketArn}/*`
            ]
        }));

        this.roleEC2.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                's3:ListBucket'
            ],
            resources: [
                props.videoBucketInput.bucketArn,
                props.videoBucketOutput.bucketArn
            ]
        }));

        // Permisos para SQS (recibir mensajes, eliminar y obtener atributos de la cola)
        this.roleEC2.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                'sqs:ReceiveMessage',
                'sqs:DeleteMessage',
                'sqs:GetQueueAttributes'
            ],
            resources: [props.videoQueue.queueArn]
        }));
    }
}