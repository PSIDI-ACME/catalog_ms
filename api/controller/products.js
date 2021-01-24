const client = require('./dbConnect');
const url = require('url');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

//Summons all Products from database:
exports.products_get_all = (req, res, next) => {
	console.log('Este pedido GET está a dar!');

	var baseQuery = 'SELECT * FROM "Products"."Products" ';
	var nameQuery = '';
	var barcodeQuery = '';

	var sortQuery = 'ORDER BY "productId"';

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
	console.log(finalQuery);

	client
		.query(finalQuery)
		.then((docs) => res.status(200).json(docs.rows))
		.catch((e) => console.error(e.stack));
};

//Summons a specific Product from database, by the id of the Product:

exports.products_get_product_by_id = (req, res, next) => {
	var id = req.params.productId;
	console.log('Este pedido GET está a dar!');
	client
		.query('SELECT * FROM "Products"."Products" WHERE "productId" = ' + id)
		.then((docs) => res.status(200).json(docs.rows))
		.catch((e) => console.error(e.stack));
};

// Obtains the rating of a Product:
exports.products_rating_product = (req, res, next) => {
	var id = req.params.productId;
	var rating = req.params.productRating;
	console.log(rating);
	var postUrl = 'http://reviews-psidi.herokuapp.com/reviews?productId=' + id;
	var xhttp = new XMLHttpRequest();
	xhttp.open('GET', postUrl, true);
	xhttp.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			var docs = JSON.parse(xhttp.responseText);
			console.log(docs._embedded.reviews);
		}
	};
	xhttp.send();

	function myFunction(arr) {
		var i;
		for (i = 0; i < arr.length; i++) {
			main(arr[i].score);
		}
	}
	// var productRating = myFunction(rating);
	client
		.query('SELECT "Products" FROM "Products"."Products" WHERE "productId" = ' + id)
		.then((docs) => res.status(200).json(docs.rows))
		.catch((e) => console.error(e.stack));
};

// Updates the score of the Reviews:
exports.products_score_update = (req, res, next) => {
	const score = req.params.score;
	const productId = req.params.productId;

	client
		.query('SELECT * FROM "Products"."Products" WHERE "productId" = ' + productId)
		.then((docs) => {
			// res.status(200).json(docs.rows)
			if (docs.rows[0].nr_Reviews == 0) {
        client
        .query('UPDATE "Products"."Products" WHERE "productId" = ' + productId + 'SET productRating = ' + score + ', nr_Votes = '+ 1)
        .then(docs => res.status(200).json('score received'))
        .catch(e => console.error(e.stack))
			 }else{
      var tempScore= docs.rows[0].productRating* docs.rows[0].nr_Votes;
      var tempVotes=docs.rows[0].nr_Votes+1;
      score = (score + tempScore)/tempVotes;
        client
        .query('UPDATE "Products"."Products" WHERE "productId" = ' + productId + 'SET productRating = ' + score + ', nr_Votes = '+ )
        .then(docs => res.status(200).json())
        .catch(e => console.error(e.stack))
      }

			var result = docs.rows[0].productRating + score;
		})
		.catch((e) => console.error(e.stack));
};

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
