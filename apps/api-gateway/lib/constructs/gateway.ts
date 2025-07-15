import { Construct } from "constructs";
import { NodejsLambda } from "../../../../libs/aws/nodejs-lambda";
import { LambdaIntegration, MockIntegration, PassthroughBehavior, Resource, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Lambda } from "aws-cdk-lib/aws-ses-actions";
import { CfnOutput } from "aws-cdk-lib";

interface ApiGatewayProps {
    add: NodejsLambda;
    list: NodejsLambda;
    getOne: NodejsLambda;
    update: NodejsLambda;
    delete: NodejsLambda;
}

export class ApiGateway extends Construct {
    constructor(scope: Construct, id: string, props: ApiGatewayProps) {
        super(scope, id);

        const api = new RestApi(this, "ApiGateway", {
            restApiName: "Product Service",
            description: "This service serves products.",
        });

        const addIntegration = new LambdaIntegration(props.add)
        const listIntegration = new LambdaIntegration(props.list);
        const getOneIntegration = new LambdaIntegration(props.getOne);
        const updateIntegration = new LambdaIntegration(props.update);
        const deleteIntegration = new LambdaIntegration(props.delete);

        const products = api.root.addResource("products");
        products.addMethod("POST", addIntegration)
        products.addMethod("GET", listIntegration);
        this.addCorsOptions(products);

        const product = products.addResource("{id}");
        product.addMethod("GET", getOneIntegration);
        product.addMethod("PUT", updateIntegration);
        product.addMethod("DELETE", deleteIntegration);
        this.addCorsOptions(product);

        new CfnOutput(this, "ApiEndpoint", {
            value: api.url,
            description: "The endpoint of the API Gateway",
        })

        new CfnOutput(this, "products", {
            value: products.path
        });

        new CfnOutput(this, "product", {
            value: product.path
        });
    }

    private addCorsOptions(resource: Resource) {
        resource.addMethod("OPTIONS", new MockIntegration({
            integrationResponses: [{
                statusCode: "200",
                responseParameters: {
                    "method.response.header.Access-Control-Allow-Origin": "'*'",
                    "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
                    "method.response.header.Access-Control-Allow-Methods": "'GET,POST,PUT,DELETE,OPTIONS'"
                }
            }],
            passthroughBehavior: PassthroughBehavior.NEVER,
            requestTemplates: {
                "application/json": '{"statusCode": 200}'
            }
        }), {
            methodResponses: [{
                statusCode: "200",
                responseParameters: {
                    "method.response.header.Access-Control-Allow-Origin": true,
                    "method.response.header.Access-Control-Allow-Headers": true,
                    "method.response.header.Access-Control-Allow-Methods": true
                }
            }]
        });
    }
}
