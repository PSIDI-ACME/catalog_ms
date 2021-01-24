const client = require('./dbConnect');
const url = require('url');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const { linkSync } = require('fs');


// Obtains all Products from database:
exports.products_get_all = (req, res, next) => {

	var baseQuery = 'SELECT * FROM "Products"."Products" ';
	var nameQuery = '';
	var barcodeQuery = '';
	var sortQuery = 'ORDER BY "productId"';
  var links = new Object;
  var embedded = new Object;
	var productId = req.params.productId;
	var rating = req.params.productRating;

    links.self=new Object;
    links.find=new Object;
    links.self.href="http://catalog-psidi.herokuapp.com/products";
    links.find.href="http://catalog-psidi.herokuapp.com/products/{:Id}";
    
	if(
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
      var products = [];

      for (i = 0; i < docs.rows.length; i++) {
        var links_temp = new Object;
        var itemref = new Object;
        var _links=[];

        itemref.href="http://catalog-psidi.herokuapp.com/products/" + docs.rows[i].productId;
        items.push(itemref)

        links_temp.self = new Object;
        links_temp.reviews = new Object;
        links_temp.rating = new Object;

        links_temp.self.href = "http://catalog-psidi.herokuapp.com/products/"+docs.rows[i].productId;
        links_temp.reviews.href ="https://reviews-psidi.herokuapp.com/reviews?productId=" +docs.rows[i].productId;
        links_temp.rating.href = "http://catalog-psidi.herokuapp.com/products/"+docs.rows[i].productId+"/rating";


        _links.push(links_temp);
        products[i]=new Object;
        products[i]._links=_links;
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


    links.self=new Object;

    links.self.href="http://catalog-psidi.herokuapp.com/products/"+ productId;
    
	client
		.query('SELECT * FROM "Products"."Products" WHERE "productId" = ' + productId)
		.then((docs) => {
      docs.rows.sort(function(a, b) {
      return (a.publishingdate < b.publishingdate) ? -1 : ((a.publishingdate > b.publishingdate) ? 1 : 0);
      });

      var _links_reviews = new Object;
      var _links_rating = new Object;
      var reviews=new Object;
      var rating=new Object;

      _links_reviews.self=new Object;
      _links_rating.self=new Object;

    _links_reviews.self.href="http://reviews-psidi.herokuapp.com/reviews?productId="+docs.rows[0].productId;
    _links_rating.self.href="http:/catalog-psidi.herokuapp.com/products/"+docs.rows[0].productId+"/rating";

    reviews._links=_links_reviews;
    rating._links=_links_rating;

    embedded.reviews = reviews;
    embedded.rating = rating;

    res.status(200).json({
    "_links": links,
    "_embedded": embedded,
    "productId": docs.rows[0].productId,
    "productName":docs.rows[0].productName,
    "productBrand":docs.rows[0].productBrand,
    "price":docs.rows[0].price,
    "productBarcode":docs.rows[0].productBarcode,
    "nr_Reviews":docs.rows[0].nr_Reviews
    })
  })
		.catch((e) => console.error(e.stack));
};












// Obtains the rating of a Product:
exports.products_rating_product = (req, res, next) => {
	var productId = req.params.productId;
  var embedded = new Object;
  var links = new Object;

  if(productId != undefined){

    links.self=new Object;
    links.product=new Object;

    links.self.href="http://catalog-psidi.herokuapp.com/products/" + productId +"/rating";
    links.product.href="http://catalog-psidi.herokuapp.com/products/" + productId;
    }

  client
    .query('SELECT * FROM "Products"."Products" WHERE "productId" = ' + productId)
    .then((docs) =>{  
    res.status(200).json({
    "_links": links,
    "rating": docs.rows[0].productRating
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


exports.get_routes = (req, res, next) => {
    var links = new Object;


    links.search = new Object;
    links.rating = new Object;
    links.list = new Object;


    links.search.href = "http://catalog-psidi.herokuapp.com/products/{:id}";
    links.rating.href = "http://catalog-psidi.herokuapp.com/products/{:id}/rating";
    links.list.href = "http://catalog-psidi.herokuapp.com/products";


    res.status(200).json({
        "_links": links
    });
}



