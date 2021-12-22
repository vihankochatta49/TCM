const router = express.Router();
const fs = require("fs");
const store = require("../middleware/multer");
const a = require("./../routes/models");

router.post("/uploadmultiple", store.array("images", 12), (req, res, next) => {
  const files = req.files; //gives all files selected by user

  //if no files selected
  if (!files) {
    const err = new Error("Please choose files");
    error.httpStatusCode = 400;
    return next(err);
  }

  // convert images to base64 emcoding
  let imgArray = files.map((file) => {
    let img = fs.readFileSync(file.path); //this convert image into buffer

    return (encode_image = img.toString("base64"));
  });

  let result = imgArray.map((src, index) => {
    //create object to store data in db
    let finalimg = {
      filename: files[index].originalname,
      contentType: files[index].mimetype,
      imageBase64: src,
    };

    let newUpload = new a(finalimg);

    return newUpload
      .save()
      .then(() => {
        return { msg: `${files[index].originalname}Uploaded successfully...` };
      })
      .catch((error) => {
        if (error) {
          if (error) {
            if (error.name === "MongoError" && error.code === 11000)
              return Promise.reject({
                error: `Duplicate ${files[index].originalname}`,
              });
          }
          return Promise.reject({
            error:
              error.message || `cannot upload ${files[index].originalname}`,
          });
        }
      });
  });

  Promise.all(result)
    .then((msg) => {
      console.log("msg");
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
