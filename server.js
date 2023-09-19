import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import bodyparser from "body-parser";
import cors from "cors";
import path from "path";
// import { fileURLToPath } from "url";

const app = express();

//config env
dotenv.config();

//config databse
connectDB();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

//middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, "./client/build")));
const PORT = process.env.PORT || 5000;

//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

// rest api

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.get("/", (req, res) => {
  res.send({
    message:"this is e-commerce website"
  });
});

app.listen(PORT, () => {
  console.log(`app is running at ${PORT}`.yellow);
});
