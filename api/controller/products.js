// var Product = require("../models/product");
const client = require("./dbConnect");

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



/* 
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