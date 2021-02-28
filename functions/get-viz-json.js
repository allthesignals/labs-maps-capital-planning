const request = require('superagent');
require('dotenv').config();

exports.handler = async (event) => {
  const { id, userName } = event.queryStringParameters;
  const site = `https://${userName}.carto.com/api/v3/viz/${id}/viz.json?api_key=${process.env.CARTO_MASTER_KEY}`;

  const response = await request
    .get(site);

  return {
    'statusCode': 200,
    'headers': {
      'Content-Type': 'application/json',
    },
    'body': response.text,
  }
}
