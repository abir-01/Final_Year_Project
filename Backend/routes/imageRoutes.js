const express = require("express");
const { getAllImages, getSingleImage, deleteImage, uploadImage } = require("../controllers/imageController");
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


router.get("/allimages",getAllImages)

router.get('/:id', getSingleImage)


router.post('/upload', upload.single('image'),uploadImage )

router.delete("/:id", deleteImage)

module.exports = router;