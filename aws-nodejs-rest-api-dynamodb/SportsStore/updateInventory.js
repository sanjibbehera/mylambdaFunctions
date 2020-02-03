
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (typeof data.inventoryName !== 'string' && typeof data.inventoryCount !== 'number' && typeof data.inventoryPrice !== 'number') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t update the inventory item.',
    });
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      inventoryId: event.pathParameters.inventoryId,
    },
    ExpressionAttributeNames: {
      '#inventory_name': 'text',
    },
    ExpressionAttributeValues: {
      ':inventoryName': data.inventoryName,
      ':inventoryCount': data.inventoryCount,
      ':inventoryPrice': data.inventoryPrice,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET #inventory_name = :inventoryName, inventoryCount = :inventoryCount, inventoryPrice = :inventoryPrice, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};