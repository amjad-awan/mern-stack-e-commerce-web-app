import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import { jwtToken } from "../helpers/jwt.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// User Registration
export const registerController = async (req, res) => {
  const { name, email, password, phone, address, answer, role } = req.body;
  try {
    //validation
    if (!name) {
      res.send({
        message: "Name is required",
      });
    }
    if (!email) {
      res.send({
        message: "Email is required",
      });
    }
    if (!password) {
      res.send({
        message: "Password is required",
      });
    }
    if (!phone) {
      res.send({
        message: "Phone No. is required",
      });
    }
    if (!address) {
      res.send({
        message: "Address is required",
      });
    }
    if (!answer) {
      res.send({
        message: "Answer is required",
      });
    }

    //check if user already exist
    const existingUser = await userModel.findOne({ email });
    // when exists
    if (existingUser) {
      res
        .status(200)
        .json({ success: false, message: "User already exist please login" });
    }

    // Register user
    const hashedPassrod = await hashPassword(password);

    //save user in database
    const User = await new userModel({
      name,
      email,
      password: hashedPassrod,
      phone,
      address,
      answer,
      role,
    }).save();
    res.status(201).json({
      success: true,
      message: "User Registered successfully",
      user: User,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error in registration",
      error: err,
    });
  }
};

// User login
export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    // check if user register or not
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: true,
        message: "Email does not registered",
      });
    }
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    const token = await jwtToken(user._id);
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error in login",
      error: err,
    });
  }
};

// test controller
export const testController = async (req, res) => {
  res.status(200).send("projected route");
};

//forgorPasswordController
export const forgorPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({
        message: "Email is required",
      });
    }
    if (!answer) {
      res.status(400).send({
        message: "answer is required",
      });
    }
    if (!newPassword) {
      res.status(400).send({
        message: "New password is required",
      });
    }

    //Check
    const user = await userModel.findOne({ email, answer });

    console.log("user ===", user);
    if (!user) {
      res.status(404).send({
        message: "Wrong Email Or Answer",
      });
    }

    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, {
      password: hashed,
    });

    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

// update profile controller

export const userProfileController = async (req, res) => {
  try {
    const { name, phone, password, address } = req?.body;
    console.log("req?.body === ", req?.body);
    const user = await userModel.findById(req.user._id);

    // password
    if (password && password.length < 6) {
      res.json({
        error: "Password is required and 6 character long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    console.log("updatedUser === ", updatedUser);

    res.status(200).send({
      success: true,
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while updating profile",
      error,
    });
  }
};

// orders
export const getOrdesrController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

// get all orders
export const getALlOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({
        createdAt: "-1",
      });
    res.json(orders);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};


//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};
