import express from "express";
import { isAdmin, requiresSignIn } from "../middlewares/authMiddleware.js";
import {
  createProductController,
  getProductController,
  getSingleProductController,
  deleteProductController,
  productPhotoController,
  updateProductController,
  productFiltersController,
  productCountController,
  productListController,
  searchProductController,
  relatedProductController,
  productCategoryController,
  braintreeTokenController,
  brainTreePaymentController,
} from "../controllers/productController.js";
import formidable from "express-formidable";
const router = express.Router();

// routes

// create product
router.post(
  "/create-product",
  requiresSignIn,
  isAdmin,
  formidable(),
  createProductController
);

router.get("/get-products", getProductController);
router.get("/get-single-product/:pid", getSingleProductController);

// photo route
router.get("/product-photo/:pid", productPhotoController);
//update product
router.put(
  "/update-product/:pid",
  requiresSignIn,
  isAdmin,
  formidable(),
  updateProductController
);
// delete route
router.delete("/delete-product/:pid", deleteProductController);

// filter products
router.post("/product-filters", productFiltersController);

// filter products
router.get("/product-count", productCountController);

//products list
router.get("/product-list/:page", productListController);

//products list
router.get("/search/:keyword", searchProductController);

//similar products
router.get("/related-product/:pid/:cid", relatedProductController);

//category based products
router.get("/product-category/:cid", productCategoryController);

// //payment routes
// //token
// router.get("/braintree/token", braintreeTokenController);

// //paymenst
// router.post("/braintree/payment", requiresSignIn, brainTreePaymentController);
export default router;
