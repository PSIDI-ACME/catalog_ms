const client = require('./dbConnect');
const url = require('url');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const { linkSync } = require('fs');
// qwerty
// Obtains all Products from database:
exports.products_get_all = (req, res, next) => {

	var baseQuery = 'SELECT * FROM "Products"."Products" ';
	var nameQuery = '';
	var barcodeQuery = '';
	var sortQuery = 'ORDER BY "productId"';
  var links = new Object;
  var embedded = new Object;
	var productId = req.params.productId;


  if(productId != undefined){

    links.self=new Object;
    links.next=new Object;
    links.start=new Object;
    links.previous=new Object;
    links.last=new Object;
    links.find=new Object;
    links.item=new Object;
    links.self.href="http://catalog-psidi.herokuapp.com/v1/products";
    links.next.href="http://catalog-psidi.herokuapp.com/products?productId=" + productId + "&page=2";
    links.start.href="http://catalog-psidi.herokuapp.com/products?productId=" + productId + "&page=1";
    links.previous.href="http://catalog-psidi.herokuapp.com/products?productId=" + productId + "&page=1";
    links.last.href="http://catalog-psidi.herokuapp.com/products?page=%7B?lastPage%7D";
    links.find.href="http://catalog-psidi.herokuapp.com/products/%7B:id%7D";
    links.item.href="/products?productId=" + productId + "&page=1", href="/products?productId=" + productId + "&page=2", href="/products?productId=" + productId + "&page=3", href= "/products?productId=" + productId + "&page=4", href="/products?productId=" + productId + "&page=5";
    }
    
	if (
		(req.query.productBarcode != '' && req.query.productBarcode != undefined) ||
		(req.query.productName != '' && req.query.productName != undefined)
	) {
		baseQuery += 'WHERE ';
	}

	if (req.query.productBarcode != '' && req.query.productBarcode != undefined) {
		barcodeQuery = '"productBarcode" = \'' + req.query.productBarcode + "' ";
		if (req.query.productName != '' && req.query.productName != undefined) {
			nameQuery = 'AND "productName" = \'' + req.query.productName + "' ";
		}
	} else if (req.query.productName != '' && req.query.productName != undefined) {
		nameQuery = '"productName" = \'' + req.query.productName + "' ";
	}

	var finalQuery = baseQuery + barcodeQuery + nameQuery + sortQuery;

	client
		.query(finalQuery)
    .then(docs =>{
      docs.rows.sort(function(a, b) {
      return (a.publishingdate < b.publishingdate) ? -1 : ((a.publishingdate > b.publishingdate) ? 1 : 0);
      });
      var items = [];
      var reviews = [];
      for (i = 0; i < docs.rows.length; i++) {
        var links_temp = new Object;
        var itemref = new Object;
        itemref.href="http://catalog-psidi.herokuapp.com/products" + docs.rows[i].id;
        items.push(itemref)

        links_temp.self = new Object;
        links_temp.product = new Object;
        links_temp.productName = new Object;
        links_temp.productDescription = new Object;
        links_temp.productBrand = new Object;
        links_temp.productBarcode = new Object;
        links_temp.price = new Object;
        links_temp.productRating = new Object;
        links_temp.nr_Reviews= new Object;

        links_temp.self.href = "http://catalog-psidi.herokuapp.com/products/1";
        links_temp.product.href = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].objectid;
        links_temp.productName.href = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].productName;
        links_temp.productBrand.href = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].productBrand;
        links_temp.productBarcode.href = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].productBarcode;
        links_temp.price.href = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].price;
        links_temp.productRating.href = "http://catalog-psidi.herokuapp.com/product/1" + docs.rows[i].productRating;
        links_temp.nr_Reviews.href= "http://catalog-psidi.herokuapp.com/product/1" + docs.rows[i].nr_Reviews;
        products.push(links_temp);
      }
      links.items = items;
      var size = docs.rows.length;
      embedded.products = products;
      embedded.rating = rating;
      res.status(200).json({
          "_links": links,
          "size": size,
          "_embedded": embedded
      })
    })
    .catch((e) => console.error(e.stack));
};


// Obtains a specific Product from database, by the id of the Product:
exports.products_get_product_by_id = (req, res, next) => {
	var productId = req.params.productId;
  var links = new Object;
  var embedded = new Object;

  if(productId != undefined){

    links.self=new Object;

    links.self.href="http://catalog-psidi.herokuapp.com/products?productId="+ productId;
    links.start.href="http://catalog-psidi.herokuapp.com/products?productId=" + productId + "&page=1";
    links.product.href="http://catalog-psidi.herokuapp.com/products?productId=" + productId + "&page=1";
    links.reviews.href="http://catalog-psidi.herokuapp.com/products?page=%7B?lastPage%7D";
    links.find.href="http://catalog-psidi.herokuapp.com/products/%7B:id%7D";
    links.item.href="/products/1", href= "/products/2", href="/products/3", href= "/products/4", href="/products/5";
    }


	client
		.query('SELECT * FROM "Products"."Products" WHERE "productId" = ' + id)
		.then((docs) => {
      docs.rows.sort(function(a, b) {
      return (a.publishingdate < b.publishingdate) ? -1 : ((a.publishingdate > b.publishingdate) ? 1 : 0);
      });
    var items = [];
    var reviews = [];
    for (i = 0; i < docs.rows.length; i++) {
        var links_temp = new Object;
        var itemref = new Object;
        itemref.href="http://catalog-psidi.herokuapp.com/products" + docs.rows[i].id;
        items.push(itemref)

        links_temp.self = new Object;
        links_temp.product = new Object;
        links_temp.productName = new Object;
        links_temp.productDescription = new Object;
        links_temp.productBrand = new Object;
        links_temp.productBarcode = new Object;
        links_temp.price = new Object;
        links_temp.productRating = new Object;
        links_temp.nr_Reviews= new Object;

        links_temp.self.href = "http://catalog-psidi.herokuapp.com/products/" + docs.rows[i].id;
        links_temp.product.href = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].objectid;
        links_temp.productName.href = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].productName;
        links_temp.productBrand.href = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].productBrand;
        links_temp.productBarcode.href = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].productBarcode;
        links_temp.price.href = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].price;
        links_temp.productRating.href = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].productRating;
        links_temp.nr_Reviews.href= "http://catalog-psidi.herokuapp.com/product/1" + docs.rows[i].nr_Reviews;
        products.push(links_temp);
    }
    links.items = items;
    var size = docs.rows.length;
    embedded.reviews = reviews;
    embedded.rating = rating;
    res.status(200).json({
    "_links": links,
    "size": size,
    "_embedded": embedded
    })
  })
		.catch((e) => console.error(e.stack));
};












// Obtains the rating of a Product:
exports.products_rating_product = (req, res, next) => {
	var id = req.params.productId;
  var embedded = new Object;

  if(productId != undefined){

    links.self=new Object;
http://catalog-psidi.herokuapp.com/products/{:Id}/rating
    links.self.href="http://catalog-psidi.herokuapp.com/products?productId=" + productId +"?rating="+ productRating;
    links.product.href="http://catalog-psidi.herokuapp.com/products?productId=" + productId + "&page=1";
    }

  client
    .query('SELECT * FROM "Products"."Products" WHERE "productId" = ' + id)
    .then((docs) =>{
 docs.rows.sort(function(a, b) {
      return (a.publishingdate < b.publishingdate) ? -1 : ((a.publishingdate > b.publishingdate) ? 1 : 0);
      });
    var items = [];
    var reviews = [];
    for (i = 0; i < docs.rows.length; i++) {
        var links_temp = new Object;
        var itemref = new Object;
        itemref.href="http://catalog-psidi.herokuapp.com/products" + docs.rows[i].id;
        items.push(itemref)

        links_temp.self = new Object;
        links_temp.product = new Object;
        links_temp.productName = new Object;
        links_temp.productRating = new Object;
        links_temp.nr_Reviews= new Object;

        links_temp.self.href = "http://catalog-psidi.herokuapp.com/products/" + docs.rows[i].id;
        links_temp.product.href = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].objectid;
        links_temp.productName.href = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].productName;
        links_temp.productRating.href = "http://catalog-psidi.herokuapp.com/product/" + docs.rows[i].productRating;
        links_temp.nr_Reviews.href= "http://catalog-psidi.herokuapp.com/product/1" + docs.rows[i].nr_Reviews;
        products.push(links_temp);
    }
    links.items = items;
    var size = docs.rows.length;
    embedded.reviews = reviews;
    res.status(200).json({
    "rating": docs.rows[0].productRating,
    "_links": links,
    "size": size,
    "_embedded": embedded
    })
})   
    .catch(e => console.error(e.stack))
};



















// Updates the score of the Reviews:
exports.products_score_update = (req, res, next) => {

  const queryObject = url.parse(req.url, true).query;
  var productId = parseInt(queryObject.productId);
  var score = parseInt(queryObject.score);


	client
		.query('SELECT * FROM "Products"."Products" WHERE "productId" = ' + productId)
		.then((docs) => {
	if (docs.rows[0].nr_Reviews == 0) {

        client
        .query('UPDATE "Products"."Products"  SET "productRating" = $2, "nr_Reviews" = $3 WHERE "productId" = $1',[productId,score,1])
        .then(docs => res.status(200).json(docs.rows))
        .catch(e => console.error(e.stack)) 
	}else{

      var tempScore= docs.rows[0].productRating* docs.rows[0].nr_Reviews;
      var tempReviews=docs.rows[0].nr_Reviews+1;
      score = (score + tempScore)/tempReviews;

        client
        .query('UPDATE "Products"."Products"  SET "productRating" = $2, "nr_Reviews" = $3 WHERE "productId" = $1',[productId,score,tempReviews])
        .then(docs => res.status(200).json(docs.rows))
        .catch(e => console.error(e.stack))
  }
			var result = docs.rows[0].productRating + score;
		})
		.catch((e) => console.error(e.stack));
};

/* 
exports.products_update_product = (req, res, next) => {

 
  
  var id= req.params.productId;
  const queryObject = url.parse(req.url, true).query;
  const productId = queryObject.productId;
  const productName = queryObject.productName;
  const productBrand = queryObject.productBrand;
  const productBarcode = queryObject.productBarcode;
  const price = queryObject.price;
  const productRating = queryObject.productRating;
  const nr_Reviews = queryObject.nr_Reviews;
  client
  .query('SELECT "Products" FROM "Products"."Products" WHERE "productId" = '+id)
  .then(docs => updateProduct(docs.rows,review))
  .catch(e => console.error(e.stack))

}


exports.products_create_product=(req,res,next)=>{
  

  client
  .query("INSERT INTO Products.Products (status, score, reviewDescription, publishingDate, funnyFact) VALUES ('pending', '" + req.body.score + "', '" + req.body.productDescription + "', '" + getDate() + "', 'default')",
      (err, res) => {
          client.end();
      }
  )
  .catch(e => console.error(e.stack + "teste")) 
  ;

}
*/
