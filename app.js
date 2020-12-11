const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { Pool, Client } = require('pg');


//const productRoutes = require("./api/routes/products");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Routes which should handle requests
// app.use("/products", productRoutes);

const client = new Client({
  user: 'uktrtdoklswema',
  host: 'ec2-99-81-238-134.eu-west-1.compute.amazonaws.com',
  database: 'd56vth083636vl',
  password: '2c174b8522aa6c46fbfe4668014e383c1fbce0f706e7cd2d3e3b7dabac6d653e',
  port: 5432,
  ssl: {rejectUnauthorized: false}
})
client.connect()

client
    .query('SELECT * FROM "Customers"."Customers"')
    .then(res => console.log(res.rows))
    .catch(e => console.error(e.stack))

module.exports = app;