const multer = require("multer");

const upload = () => {
  // Set up storage for uploaded files
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  // Midleware
  // Create the multer instance
  const upload = multer({ storage: storage });
  // const upload = multer({ dest: 'uploads/' })

  return upload;
};

module.exports = upload();
