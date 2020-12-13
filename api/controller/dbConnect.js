const { Pool, Client } = require('pg');

const client = new Client({
    user: 'uktrtdoklswema',
    host: 'ec2-99-81-238-134.eu-west-1.compute.amazonaws.com',
    database: 'd56vth083636vl',
    password: '2c174b8522aa6c46fbfe4668014e383c1fbce0f706e7cd2d3e3b7dabac6d653e',
    port: 5432,
    ssl: {rejectUnauthorized: false}
})
client.connect();
client.on('connect', () => {
    console.log('Base de Dados conectada com sucesso!');
  });
  
client.Promise = global.Promise;

module.exports = client;