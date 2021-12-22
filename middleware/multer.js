const multer = require("multer");

//set storage
var storage = multer.diskStorage({
  // where image store in disk
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },

  //filename given to store image
  filename: function (req, file, cb) {
    var ext = file.originalname.substr(file.originalname.lastIndexOf("."));
    cb(null, file.fieldname + "-" + Date.now() + ext);
    //originalname name of file in user computer
    //fieldname filename specified in the form
  },
});

store = multer({ storage: storage });
module.exports = store;
