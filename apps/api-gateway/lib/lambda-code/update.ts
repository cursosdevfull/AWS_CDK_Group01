import { DeleteItemCommand, DeleteItemCommandInput, DynamoDBClient, UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

const client = new DynamoDBClient();

export const handler = async (event: APIGatewayProxyEvent): Promise<any> => {
    console.log("Event: ", JSON.stringify(event, null, 2));

    const productId = event.pathParameters?.id;
    const body = event.body ? JSON.parse(event.body) : {};

    if (!productId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Product ID is required" }),
        };
    }

    const input: UpdateItemCommandInput = {
        TableName: process.env.TABLE_NAME,
        Key: {
            productId: { S: productId },
        },
        UpdateExpression: "set #title = :title, #price = :price, #description = :description, #image = :image",
        ExpressionAttributeNames: {
            "#title": "title",
            "#price": "price",
            "#description": "description",
            "#image": "image"
        },
        ExpressionAttributeValues: {
            ":title": { S: body.title || "" },
            ":price": { N: body.price ? body.price.toString() : "0" },
            ":description": { S: body.description || "" },
            ":image": { S: body.image || "" }
        },
        ReturnValues: "ALL_NEW"
    }

    const command = new UpdateItemCommand(input);

    const response = await client.send(command);

    if (!response.Attributes) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: "Product not found" }),
        };
    }

    const updatedProduct = {
        productId: response.Attributes.productId.S,
        title: response.Attributes.title.S,
        price: response.Attributes.price.N,
        description: response.Attributes.description.S,
        image: response.Attributes.image.S
    };

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Product updated successfully", product: updatedProduct }),
    };
};