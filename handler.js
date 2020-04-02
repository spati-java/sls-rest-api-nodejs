'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  // region: 'localhost',
  //  endpoint: 'http://localhost:8000'
}); // remove when deploying!

// CREATE NOTE ENDPOINT
module.exports.create = (event, context, callback) => {
  // create a note and put it in the database
  const data = JSON.parse(event.body);

  const params = {
    TableName: 'NOTES',
    Item: {
      ID: uuid.v1(),
      content: data.content
    }
  }

  dynamoDb.put(params, (error) => {

    if (error) {
      console.error(error);
      return callback(null, {
        statusCode: error.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Could not create the note.'
      });
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item)
    };
    callback(null, response);
  });
}
 
// GET NOTE BY ID ENDPOINT
module.exports.getOne = (event , context, callback) => {
  const params = {
    TableName: 'NOTES',
    Key:{
      ID: event.pathParameters.id
    }
  };

  dynamoDb.get(params, (error, result) => {
    
    if(error){
      console.error(error);
      return callback(null, {
        statusCode: err.statusCode || 500,
        headers:{'Content-Type': 'text/plain'},
        body: 'Could not fetch the note.'
      });
    }
    const reponse = {
      statusCode: 200,
      body: JSON.stringify(result.Item)
    };
    callback(null, reponse);
  });
} ;

// GET ALL NOTES ENDPOINT

module.exports.getAll = (event, context, callback) => {
  const params = {
    TableName: 'NOTES',
  };

  dynamoDb.scan(params,(err, result) => {
    if(err){
      console.error(err);
      return callback(null, {
        statusCode: err.statusCode || 500,
        headers:{'Content-Type': 'text/plain'},
        body: 'Could not fetch the note.'
      });
    }
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items)
    }
    callback(null, response)
  })
}



