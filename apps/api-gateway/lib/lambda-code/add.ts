import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import * as crypto from "crypto";

const client = new DynamoDBClient();

export const handler = async (event: APIGatewayProxyEvent): Promise<any> => {
    const { title, price, description, image } = JSON.parse(event.body as string)

    const input: PutItemCommandInput = {
        TableName: process.env.TABLE_NAME,
        Item: {
            productId: { S: crypto.randomUUID() }, // Generate a unique ID for the product
            title: { S: title },
            price: { N: price.toString() },
            description: { S: description },
            image: { S: image }
        }
    }

    const command = new PutItemCommand(input);

    try {
        await client.send(command);
        console.log("Product added successfully");
        return {
            statusCode: 200,
            body: JSON.stringify({ title, price, description, image }),
        };
    } catch (error: unknown) {
        throw new Error("Error adding product: " + (error as Error).message);
    }
};