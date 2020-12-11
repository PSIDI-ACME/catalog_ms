var express = require("express");
const router = express.Router();
var ProductsController = require('../controller/products');

router.get("/", ProductsController.products_get_all);

router.post("/", ProductsController.products_create_product);

router.get("/:productId", ProductsController.products_get_product);

router.patch("/:productId",  ProductsController.products_update_product);

router.delete("/:productId", ProductsController.products_delete);

module.exports = router;

