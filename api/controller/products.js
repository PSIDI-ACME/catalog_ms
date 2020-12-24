const client = require("./dbConnect");
const url = require('url');

//Summons all Products from database:
exports.products_get_all = (req, res, next) => {
  console.log("Este pedido GET está a dar!");
client
    .query('SELECT * FROM "Products"."Products"')
    .then(docs =>res.status(200).json(docs.rows))
    .catch(e => console.error(e.stack))
};

exports.products_get_product_by_id = (req, res, next) => {

  var id= req.params.productId;
  console.log("Este pedido GET está a dar!");
  client
      .query('SELECT * FROM "Products"."Products" WHERE "productId" = '+id)
        .then(docs =>res.status(200).json(docs.rows))
        .catch(e => console.error(e.stack))
        
}

exports.products_get_product_by_name = (req, res, next) => {

  var name= req.params.productName;
  console.log("Este pedido GET está a dar!");
  client
      .query('SELECT * FROM "Products"."Products" WHERE "productName" = '+name)
        .then(docs =>res.status(200).json(docs.rows))
        .catch(e => console.error(e.stack))
        
}

exports.products_get_product_by_barcode = (req, res, next) => {

  var barCode= req.params.productBarcode;
  console.log("Este pedido GET está a dar!");
  client
      .query('SELECT * FROM "Products"."Products" WHERE "productBarcode" = '+barCode)
        .then(docs =>res.status(200).json(docs.rows))
        .catch(e => console.error(e.stack))
        
}



/* 
exports.products_update_product = (req, res, next) => {

  console.log("Este pedido PATCH está a dar!");
  
  var id= req.params.productId;
  const queryObject = url.parse(req.url, true).query;
  const productId = queryObject.productId;
  const productName = queryObject.productName;
  const productBrand = queryObject.productBrand;
  const productBarcode = queryObject.productBarcode;
  const price = queryObject.price;

  client
  .query('SELECT "Products" FROM "Products"."Products" WHERE "productId" = '+id)
  .then(docs => updateProduct(docs.rows,review))
  .catch(e => console.error(e.stack))

}


exports.products_create_product=(req,res,next)=>{
  
  console.log("Este pedido POST está a dar!");

  client
  .query("INSERT INTO Products.Products (status, score, reviewDescription, publishingDate, funnyFact) VALUES ('pending', '" + req.body.score + "', '" + req.body.productDescription + "', '" + getDate() + "', 'default')",
      (err, res) => {
          console.log(err, res);
          client.end();
      }
  )
  .then(res => console.log(res))
  .catch(e => console.error(e.stack + "teste")) 
  ;

}
*/