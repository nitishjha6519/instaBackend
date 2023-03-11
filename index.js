const mongoose = require("mongoose");
const app = require("./app");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(
  `mongodb+srv://${process.env.MONGOUSER}:${process.env.MongoPass}@cluster0.eqvbavg.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log("err " + err);
    } else {
      console.log("connected to DB");
    }
  }
);

//cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
