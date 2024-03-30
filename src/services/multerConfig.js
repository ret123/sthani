const multer = require('multer');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Specify the destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Specify the file name
  }
});

// Create a Multer instance with the specified storage configuration
const upload = multer({ storage: storage });

module.exports = upload;