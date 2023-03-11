const express = require("express");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const index = require("./index");

const postsModel = require("./schema");
// const cors = require('cors');
//buffer data of multer to string
const DatauriParser = require("datauri/parser"); //for multer memoryStorage()
const parser = new DatauriParser();
const path = require("path");

process.on("uncaughtException", function (err) {
  console.log("Caught exception: " + err);
});

const app = express();
// enable CORS without external module
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const newData = await postsModel.find();
    res.json({
      status: "success",
      newData,
    });
  } catch (e) {
    res.status(400).json({
      status: "Failed n finding documents",
      message: e.message,
    });
  }
});

//to store image in server from form data,  multer is used
const Imagestorage = multer.memoryStorage();
const upload = multer({ storage: Imagestorage });

app.post("/newpost", upload.single("image"), async (req, res) => {
  // console.log(req.body);
  // console.log(req.file);

  // convert base64 image data to string using datauri/parser and upload to cloudinary and get url
  const extName = path.extname(req.file.originalname).toString();
  const file64 = parser.format(extName, req.file.buffer);
  const filename = file64.content;

  cloudinary.uploader.upload(filename, async (error, result) => {
    if (error) {
      res.status(500).send("error in uploading file to cloudinary" + error);
    } else {
      // result.secure_url is the URL of the uploaded file on Cloudinary
      console.log(result.secure_url);

      let Imageurl = await result.secure_url;
      data = {
        name: req.body.name,
        location: req.body.location,
        likes: req.body.likes,
        description: req.body.description,
        image: Imageurl,
      };
      console.log(data);
      let postedData = await postsModel.create(data);
      res.json({
        status: "ok",
        postedData,
      });
    }
  });
});

app.get("*", (req, res) => {
  res.status(404).send("PAGE IS NOT FOUND");
});

app.listen(5000, () => console.log("Server is up at 5000"));
