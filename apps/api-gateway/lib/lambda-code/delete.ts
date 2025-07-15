import { DeleteItemCommand, DeleteItemCommandInput, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

const client = new DynamoDBClient();

export const handler = async (event: APIGatewayProxyEvent): Promise<any> => {
    console.log("Event: ", JSON.stringify(event, null, 2));

    const productId = event.pathParameters?.id;

    if (!productId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Product ID is required" }),
        };
    }

    const input: DeleteItemCommandInput = {
        TableName: process.env.TABLE_NAME,
        Key: {
            productId: { S: productId },
        },
        ReturnValues: "ALL_OLD" // This will return the deleted item
    }

    const command = new DeleteItemCommand(input);

    const response = await client.send(command);

    if (!response.Attributes) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: "Product not found" }),
        };
    }

    const deletedProduct = {
        productId: response.Attributes.productId.S,
        title: response.Attributes.title.S,
        price: response.Attributes.price.N,
        description: response.Attributes.description.S,
        image: response.Attributes.image.S
    };

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Product deleted successfully", product: deletedProduct }),
    };

};