import { divide, multiply, subtract, sum } from 'math-operations';

export const handler = async (event: any) => {
    console.log("Event received:", JSON.stringify(event, null, 2));

    const a = event.a || 0;
    const b = event.b || 0;
    const operation = event.operation || "sum";

    let result;

    try {
        switch (operation) {
            case "sum":
                result = sum(a, b);
                break;
            case "subtract":
                result = subtract(a, b);
                break;
            case "multiply":
                result = multiply(a, b);
                break;
            case "divide":
                result = divide(a, b);
                break;
            default:
                throw new Error(`Unsupported operation: ${operation}`);
        }
    } catch (error) {

    }


    // Simulate some processing
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: `Operation ${operation} performed successfully. Operators: ${a} and ${b}. Result: ${result}`,
            input: event,
        }),
    };

    return response;
}