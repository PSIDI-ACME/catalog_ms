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

exports.products_update_product = (req, res, next) => {

  console.log("Este pedido PATCH está a dar!");
  
  var id= req.params.productId;
  const queryObject = url.parse(req.url, true).query;
  const review = queryObject.review;

  client
  .query('SELECT "Reviews" FROM "Products"."Products" WHERE "productId" = '+id)
  .then(docs => updateReview(docs.rows,review))// res.status(200).json(docs.rows))
  .catch(e => console.error(e.stack))
        function updateReview(reviews,review){
          reviews =JSON.stringify(reviews)
          reviews = reviews.replace(/\s/g, '');
          var obj=JSON.parse(reviews);
          obj.push({"Reviews":review});

        client
          .query('UPDATE "Products"."Products" SET "Reviews"=$1 WHERE "productId"='+id,[obj])
          .then(docs =>res.status(200).json(docs.rows))
          .catch(e => console.error(e.stack))

        }    
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