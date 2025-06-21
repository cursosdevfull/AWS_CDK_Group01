export const handler = async (event: any) => {
    console.log("Event received:", JSON.stringify(event, null, 2));

    // Simulate some processing
    const result = {
        statusCode: 200,
        body: JSON.stringify({
            message: "Hello from Lambda03!",
            input: event,
        }),
    };

    return result;
}