const dotenv = require("dotenv").config();

// Debugging: Check if `.env` loaded successfully
if (dotenv.error) {
  console.error("Failed to load .env file:", dotenv.error);
  process.exit(1); // Exit the application
} else {
  console.log("Environment Variables Loaded Successfully.");
  console.log("DATABASE_CLOUD:", process.env.DATABASE_CLOUD);
}

process.noDeprecation = true;


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

// Import Routes
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const biddingRoute = require("./routes/biddingRoute");
const categoryRoute = require("./routes/categoryRoute");

// Import Middleware
const errorHandler = require("./middleWare/errorMiddleWare");

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));

// Routes Middleware
app.use("/api/users", userRoute);
app.use("/api/product", productRoute);
app.use("/api/bidding", biddingRoute);
app.use("/api/category", categoryRoute);

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error Middleware
app.use(errorHandler);

// Routes
app.get("/", (req, res) => {
  res.send("Home Page");
});

// Connect to Mongoose
const dbURI = process.env.DATABASE_CLOUD;
if (!dbURI) {
  console.error("Error: DATABASE_CLOUD environment variable is not defined.");
  process.exit(1);
}

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });
