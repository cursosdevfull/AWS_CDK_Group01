import * as cdk from 'aws-cdk-lib';
import { ConstructStack } from '../lib/constructs/construct.stack';
import { MicroserviceAStack } from '../lib/stacks/microservice-a.stack';
import { MicroserviceBStack } from '../lib/stacks/microservice-b.stack';
import { MicroserviceGrouping } from '../lib/stacks/microservice-grouping';
import { MicroserviceNested } from '../lib/stacks/microservice-nested';
import { EnvironmentStack } from '../lib/environments/environment.stack';

const app = new cdk.App()

new EnvironmentStack(app, 'EnvironmentStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    }
});



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