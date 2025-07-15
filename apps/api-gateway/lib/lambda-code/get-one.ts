import { DynamoDBClient, GetItemCommand, GetItemCommandInput } from "@aws-sdk/client-dynamodb";
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

    const input: GetItemCommandInput = {
        TableName: process.env.TABLE_NAME,
        Key: {
            productId: { S: productId },
        }
    }

    const command = new GetItemCommand(input);

    const response = await client.send(command);

    if (!response.Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: "Product not found" }),
        };
    }

    const product = {
        productId: response.Item.productId.S,
        title: response.Item.title.S,
        price: response.Item.price.N,
        description: response.Item.description.S,
        image: response.Item.image.S
    };

    return {
        statusCode: 200,
        body: JSON.stringify(product),
    };
};