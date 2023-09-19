import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

//Protected routes with jwt

export const requiresSignIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decode = jwt.verify(token,"QOID@NCNDF");
    req.user = decode;
    next();
  } catch (error) {
    console.log("error ", error);
  }
};

//admin acceess
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user?.role !== 1) {
      res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};
