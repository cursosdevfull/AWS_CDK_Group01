export const handler = async (event: any) => {
    console.log("Event received:", JSON.stringify(event, null, 2));

    try {
        const data = {
            receiveMessage: event.message,
            receiveTimestamp: event.timestamp,
            processedAt: new Date().toISOString(),
            processId: Math.random().toString(36).substring(2, 15),
        }

        return {
            statusCode: 200,
            body: {
                message: "Lambda02 processed the event successfully",
                data
            }
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