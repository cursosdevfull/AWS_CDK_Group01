import * as cdk from 'aws-cdk-lib';
import { ConstructStack } from '../lib/constructs/construct.stack';
import { MicroserviceAStack } from '../lib/stacks/microservice-a.stack';
import { MicroserviceBStack } from '../lib/stacks/microservice-b.stack';
import { MicroserviceGrouping } from '../lib/stacks/microservice-grouping';
import { MicroserviceNested } from '../lib/stacks/microservice-nested';
import { EnvironmentStack } from '../lib/environments/environment.stack';
import { VpcAlbStack } from '../lib/resources/01-vpc-alb';
import { RemovalPolicyStack } from '../lib/resources/03-removal-policy';
import { TagsDemo01Stack, TagsDemo02Stack } from '../lib/tags/01-tag';
import { TagsDemoStack } from '../lib/tags/02-priority';
import { S3AssetsStack } from '../lib/assets/01-s3';
import { DockerAssetsStack } from '../lib/assets/02-docker';
import { PermissionsStack } from '../lib/permissions/permissions.stack';

const app = new cdk.App()

//new DockerAssetsStack(app, 'DockerAssetsStack');
new PermissionsStack(app, 'PermissionsStack', {
    environment: {
        env: "prd"
    }
});

//new S3AssetsStack(app, 'S3AssetsStack')

//new TagsDemoStack(app, 'TagsDemoStack')

/* new TagsDemo01Stack(app, 'TagsDemo01Stack')
new TagsDemo02Stack(app, 'TagsDemo02Stack') */

//new RemovalPolicyStack(app, 'RemovalPolicyStack')


//new VpcAlbStack(app, 'VpcAlbStack')

/* new EnvironmentStack(app, 'EnvironmentStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    }
}); */



/* new EnvironmentStack(app, 'EnvironmentStack', {
    env: {
        account: "282865065290",
        region: "us-west-1"
    }
});
 */

//new MicroserviceNested(app, 'MicroserviceNested');
//new MicroserviceGrouping(app, 'MicroserviceGrouping');

/* new MicroserviceAStack(app, 'MicroserviceAStack', {});
new MicroserviceBStack(app, 'MicroserviceBStack', {}); */

//new ConstructStack(app, "ConstructStack", {})

