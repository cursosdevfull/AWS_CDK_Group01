import { SQSClient, SendMessageCommand, SendMessageCommandInput } from "@aws-sdk/client-sqs";

const client = new SQSClient();

export const handler = async (event: any) => {
    try {
        const targetQueueUrl = process.env.QUEUE_URL;

        const messageId = Math.random().toString(36).substring(2, 15);
        const timestamp = new Date().toISOString();

        const message = {
            messageId,
            timestamp,
            content: "Message from standard queue",
            source: "lambda01",
            eventData: event
        }

        const input: SendMessageCommandInput = {
            QueueUrl: targetQueueUrl,
            MessageBody: JSON.stringify(message),
        };

        const response = await client.send(new SendMessageCommand(input));

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Message sent to target queue",
                messageId: response.MessageId,
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