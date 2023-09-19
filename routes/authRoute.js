import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgorPasswordController,
  userProfileController,
  getOrdesrController,
  getALlOrdersController,
  orderStatusController,
} from "../controllers/authController.js";
import { isAdmin, requiresSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing

// REGISTER || METHOD POST
router.post("/register", registerController);

// LOGIN || METHOD POST
router.post("/login", loginController);

//Forgot password || METHOD POST
router.post("/forgot-password", forgorPasswordController);

//TEST
router.get("/test", requiresSignIn, isAdmin, testController);

//Protected User routes for auth
router.get("/user-auth", requiresSignIn, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

//protected Admin route auth
router.get("/admin-auth", requiresSignIn, isAdmin, (req, res) => {
  console.log("/admin-auth === 38");
  res.status(200).send({ ok: true });
});


// update user profile route
router.put("/update-profile", requiresSignIn, userProfileController);

// order route
router.get("/orders", requiresSignIn, getOrdesrController);

// order route
router.get("/all-orders", requiresSignIn,isAdmin, getALlOrdersController);


// order status update
router.put(
  "/order-status/:orderId",
  requiresSignIn,
  isAdmin,
  orderStatusController
);

export default router;
