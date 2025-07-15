import { LambdaClient, InvokeCommand, InvokeCommandInput, InvocationType } from "@aws-sdk/client-lambda";

const client = new LambdaClient();

export const handler = async (event: any) => {
    try {
        const targetLambdaName = process.env.TARGET_LAMBDA_NAME;

        const payload = {
            message: "Message from Lambda01",
            timestamp: new Date().toISOString(),
            originalEvent: event,
        }

        const input: InvokeCommandInput = {
            FunctionName: targetLambdaName,
            InvocationType: InvocationType.RequestResponse, // or "Event" for async invocation
            Payload: Buffer.from(JSON.stringify(payload)),
        };

        const command = new InvokeCommand(input);

        const response = await client.send(command);

        let responsePayload = {}
        if (response.Payload) {
            responsePayload = JSON.parse(Buffer.from(response.Payload).toString());
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Lambda01 invoked successfully",
                targetLambdaName: targetLambdaName,
                response: responsePayload,
            }),
        }

    } catch (error) {
        console.error("Error invoking target Lambda:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error invoking target Lambda",
                error: error instanceof Error ? error.message : String(error),
            }),
        };
    }
}