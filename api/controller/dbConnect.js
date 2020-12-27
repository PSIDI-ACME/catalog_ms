const { Pool, Client } = require('pg');

const client = new Client({
    user: 'xxltshilejseet',
    host: 'ec2-54-247-94-127.eu-west-1.compute.amazonaws.com',
    database: 'd7tqem71hsg2hk',
    password: 'd0dc22d3afa3c396823a790052f65a0ae73ad7e35d1b0e5ee12d406fa21e247f',
    port: 5432,
    ssl: {rejectUnauthorized: false}
})

client.connect();
client.on('connect', () => {
    console.log('Base de Dados conectada com sucesso!');
  });
  
client.Promise = global.Promise;

module.exports = client;