const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.inventoryName !== 'string' && typeof data.inventoryCount !== 'number' && typeof data.inventoryPrice !== 'number') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t insert the request data into Inventory Table.',
    });
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      inventoryId: uuid.v1(),
      inventoryName: data.inventoryName,
      inventoryCount: data.inventoryCount,
      inventoryPrice: data.inventoryPrice,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };
  
// write the todo to the database
dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t insert the request data into Inventory Table.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};