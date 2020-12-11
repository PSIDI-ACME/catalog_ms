var Product = require("../models/product");
exports.products_get_all = (req, res, next) => {

Product.find()
    .select()
    .exec()
    .then( docs=>{
          const response = {
            count: docs.length,
            products: docs.map(doc => {
              return {
                name: doc.name,
                brand: doc.brand,
                barcode: doc.barcode,
                price: doc.price,
                productImage: doc.productImage,
                _id: doc._id,
                request: {
                  type: "GET",
                  url: "http://localhost:3002/products/" + doc._id
                }
              };
            })
          };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.products_create_product = (req, res, next) => {
  const product = new Product({
    _id: req.body.ID,
    name: req.body.name,
    brand: req.body.brand,
    barcode: req.body.barcode,
    price: req.body.price,
  });
  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          brand: result.brand,
          barcode: result.barcode,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3002/products/" + result._id
          }
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



