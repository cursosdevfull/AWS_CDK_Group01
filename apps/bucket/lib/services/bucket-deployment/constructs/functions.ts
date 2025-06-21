import { Construct } from "constructs";
import * as path from 'path';
import * as fs from 'fs';
import * as esbuild from "esbuild"
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { IBucket } from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import admzip from 'adm-zip';

interface FunctionsProps {
    bucketLambdaCode: IBucket;
}

export class Functions extends Construct {
    constructor(scope: Construct, id: string, props: FunctionsProps) {
        super(scope, id);

        this.buildLambdaCode();
        console.log("Lambda code built successfully.");

        const codeDeployment = new s3deploy.BucketDeployment(this, 'DeployLambdaCode', {
            sources: [s3deploy.Source.asset(path.join(__dirname, "../lambda-dist"))],
            destinationBucket: props.bucketLambdaCode,
            destinationKeyPrefix: 'lambda-code',
        })

        const lambda1 = new lambda.Function(this, 'Lambda1', {
            description: 'Lambda function 1',
            runtime: lambda.Runtime.NODEJS_22_X,
            code: lambda.Code.fromBucket(props.bucketLambdaCode, 'lambda-code/lambda1/lambda1.zip'),
            handler: 'lambda1.handler',
            environment: {
                CODE_BUCKET_NAME: props.bucketLambdaCode.bucketName,
            }
        })
        lambda1.node.addDependency(codeDeployment);
        props.bucketLambdaCode.grantRead(lambda1)

        const lambda2 = new lambda.Function(this, 'Lambda2', {
            description: 'Lambda function 2',
            runtime: lambda.Runtime.NODEJS_22_X,
            code: lambda.Code.fromBucket(props.bucketLambdaCode, 'lambda-code/lambda2/lambda2.zip'),
            handler: 'lambda2.handler',
            environment: {
                CODE_BUCKET_NAME: props.bucketLambdaCode.bucketName,
            }
        })
        lambda2.node.addDependency(codeDeployment);
        props.bucketLambdaCode.grantRead(lambda2)

        const lambda3 = new lambda.Function(this, 'Lambda3', {
            description: 'Lambda function 3',
            runtime: lambda.Runtime.NODEJS_22_X,
            code: lambda.Code.fromBucket(props.bucketLambdaCode, 'lambda-code/lambda3/lambda3.zip'),
            handler: 'lambda3.handler',
            environment: {
                CODE_BUCKET_NAME: props.bucketLambdaCode.bucketName,
            }
        })
        lambda3.node.addDependency(codeDeployment);
        //props.bucketLambdaCode.grantRead(lambda3)

        const lambdaS3ReadPolicy = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['s3:GetObject', 's3:ListBucket', "s3:GetBucketLocation"],
            resources: [props.bucketLambdaCode.bucketArn, `${props.bucketLambdaCode.bucketArn}/*`]
        })

        lambda3.role?.attachInlinePolicy(
            new iam.Policy(this, 'LambdaS3ReadPolicy', {
                statements: [lambdaS3ReadPolicy]
            })
        );
    }

    private buildLambdaCode() {
        const src = path.join(__dirname, "../lambda-code")
        const dest = path.join(__dirname, "../lambda-dist")

        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        const lambdas = [
            { folder: "lambda1", file: "lambda1.ts" },
            { folder: "lambda2", file: "lambda2.ts" },
            { folder: "lambda3", file: "lambda3.ts" }
        ]

        lambdas.forEach(lambda => {
            const srcFolder = path.join(src, lambda.folder)
            const destFolder = path.join(dest, lambda.folder)
            const entryFile = path.join(srcFolder, lambda.file);
            const destFile = path.join(destFolder, `${lambda.folder}.js`);

            if (!fs.existsSync(destFolder)) {
                fs.mkdirSync(destFolder, { recursive: true });
            }

            if (!fs.existsSync(entryFile)) {
                throw new Error(`Source file ${entryFile} does not exist.`);
            }

            try {
                esbuild.buildSync({
                    entryPoints: [entryFile],
                    bundle: true,
                    minify: true,
                    sourcemap: true,
                    platform: 'node',
                    target: 'node22',
                    outfile: destFile,
                    external: ['aws-sdk'],
                    banner: {
                        js: "exports.handler = require('./').handler;"
                    }
                })

                const zip = new admzip()
                zip.addLocalFile(destFile);
                zip.writeZip(path.join(destFolder, `${lambda.folder}.zip`));

                console.log(`Successfully built ${lambda.folder} to ${destFile}`);
            } catch (error) {
                console.error(`Error processing ${lambda.folder}:`, error);
            }
        })
    }
}