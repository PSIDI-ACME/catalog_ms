const express = require("express");
const router = express.Router();
var ProductsController = require('../controller/products');

router.get("/",ProductsController.products_get_all);

router.get("/routes",ProductsController.get_routes);

router.get("/:productId", ProductsController.products_get_product_by_id);

router.get("/:productId/rating",ProductsController.products_rating_product);

router.get("/score/refresh",ProductsController.products_score_update);


module.exports = router;