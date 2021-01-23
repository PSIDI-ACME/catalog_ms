const client = require("./dbConnect");
const url = require('url');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


//Summons all Products from database:
exports.products_get_all = (req, res, next) => {
  console.log("Este pedido GET está a dar!");

  var baseQuery ='SELECT * FROM "Products"."Products" ';
  var nameQuery = '';
  var barcodeQuery ='';

  var sortQuery='ORDER BY "productId"';

  if ((req.query.productBarcode != '' && req.query.productBarcode!= undefined) || (req.query.productName !='' && req.query.productName!= undefined)) {
    baseQuery += "WHERE ";
  }
  
  if (req.query.productBarcode != '' && req.query.productBarcode!= undefined){
    barcodeQuery = '"productBarcode" = \'' + req.query.productBarcode+'\' ';
    if(req.query.productName !='' && req.query.productName!= undefined){
      nameQuery = 'AND "productName" = \'' + req.query.productName+'\' ';
    }
  }else if (req.query.productName !='' && req.query.productName!= undefined){
    nameQuery = '"productName" = \'' + req.query.productName+'\' ';
  }

  var finalQuery = baseQuery + barcodeQuery + nameQuery+ sortQuery;
console.log(finalQuery);

client
    .query(finalQuery)
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

exports.products_rating_product=(req,res,next) =>{
  var id= req.params.productId;
  var rating= req.params.productRating;
  var postUrl = 'http://reviews-psidi.herokuapp.com/reviews?productId='+id;
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {  
  if (this.readyState === 4 && this.status === 200) {
    console.log("Este pedido GET está a dar!");    }
  }
  xhttp.open('GET',postUrl, true);
  xmlhttp.send();

  function myFunction(arr) {
    var out = "";
    var i;
    for(i = 0; i < arr.length; i++) {
      main(arr[i].score);
  }
}
  var productRating = myFunction(rating);
  client
    .query('SELECT "Products" FROM "Products"."Products" WHERE "productId" = '+id)
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