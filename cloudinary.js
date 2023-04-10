const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "chriscloud1207",
  api_key: "277692943448618",
  api_secret: "2-7EPK4JT6bDxvY5TFTmPqtwsHc"
});

module.exports = cloudinary;