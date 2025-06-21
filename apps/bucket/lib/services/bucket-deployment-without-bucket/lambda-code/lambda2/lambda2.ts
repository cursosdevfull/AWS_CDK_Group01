import { Handler } from "aws-cdk-lib/aws-lambda";

export const handler: Handler = async (event: any) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Hello from Lambda 2!",
            input: event,
        }),
    }
}