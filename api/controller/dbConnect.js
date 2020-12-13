const { Pool, Client } = require('pg');

const client = new Client({
    user: 'xhxlvseuqrvtjf',
    host: 'ec2-54-163-215-125.compute-1.amazonaws.com',
    database: 'd8g80jlg8bo0i3',
    password: 'f7ed5215c032f921b4c83aa3d10a9425be61a24f812d8fccd89e27d563082531',
    port: 5432,
    ssl: {rejectUnauthorized: false}
})

client.connect();
client.on('connect', () => {
    console.log('Base de Dados conectada com sucesso!');
  });
  
client.Promise = global.Promise;

module.exports = client;