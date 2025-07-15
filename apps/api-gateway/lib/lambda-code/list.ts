import { DynamoDBClient, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

const client = new DynamoDBClient();

export const handler = async (event: APIGatewayProxyEvent): Promise<any> => {
    console.log("Event: ", JSON.stringify(event, null, 2));

    const input: ScanCommandInput = {
        TableName: process.env.TABLE_NAME,
    }

    const command = new ScanCommand(input);

    const response = await client.send(command);

    if (!response.Items || response.Items.length === 0) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: "No products found" }),
        };
    }

    const products = response.Items.map(item => ({
        productId: item.productId.S,
        title: item.title.S,
        price: item.price.N,
        description: item.description.S,
        image: item.image.S
    }));


    return {
        statusCode: 200,
        body: JSON.stringify(products),
    };
};