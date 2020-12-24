const express = require("express");
const router = express.Router();
var ProductsController = require('../controller/products');

router.get("/",ProductsController.products_get_all);

router.get("/:productId", ProductsController.products_get_product_by_id);

router.get("/:productName", ProductsController.products_get_product_by_Name);

router.get("/:productBarcode", ProductsController.products_get_product_by_Barcode);



/*
router.post("/:productId",ProductsController.products_update_product);

router.post("/", ProductsController.products_create_product);

router.delete("/:productId", ProductsController.products_delete);
*/
module.exports = router;