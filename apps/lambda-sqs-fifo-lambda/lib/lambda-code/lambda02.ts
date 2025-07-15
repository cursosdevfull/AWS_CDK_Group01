import { SQSEvent, SQSHandler } from 'aws-lambda';

export const handler: SQSHandler = async (event: SQSEvent) => {
    console.log("Event received:", JSON.stringify(event, null, 2));

    try {
        for (const record of event.Records) {
            const message = JSON.parse(record.body);
            console.log("Processing message:", message);

            // Simulate some processing logic
            await new Promise((resolve) => setTimeout(resolve, 1000));

            console.log("Message processed successfully:", message);
        }

    } catch (error) {
        console.error("Error processing event in Lambda02:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error processing event in Lambda02",
                error: error instanceof Error ? error.message : String(error),
            }),
        };
    }
}