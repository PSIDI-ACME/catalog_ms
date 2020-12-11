var Product = require("../models/product");
const { Pool, Client } = require('pg');
var bodyParser = require("body-parser");

exports.products_get_all = (req, res, next) => {
  
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
      .query('SELECT * FROM "Products"."Products"')
      .then(res => console.log(res.rows))
      .catch(e => console.error(e.stack))

};

exports.products_create_product = (req, res, next) => {
  
  const id = req.params.productId;


};

exports.products_update_product = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3002/products/" + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.products_delete = (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/products",
          body: { name: "String", price: "Number" }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.catalog_get_product_barcode = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name brand  barcode bprice _id productImage")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/products"
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};