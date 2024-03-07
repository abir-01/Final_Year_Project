const { uploadFile, deleteFile, getObjectSignedUrl } = require('../s3.js');

const sharp = require('sharp');
const crypto = require('crypto');
const Images = require('../models/imageModel.js');



const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

function newLock() {
  var unlock, lock = new Promise((res, rej) => { unlock = res; });
  return [lock, unlock];
}

const getAllImages = async (req, res) => {
  const images = await Images.find();
  // console.log(images);

  if (images.length === 0) {
    res.status(404).json({ message: "No files found!" });
  }

  else {

    var [lock, unlock] = newLock();

    var imageLinks = [];

    let count = 0;

    for (let image of images) {
      imageUrl = await getObjectSignedUrl(image.image)
      imageLinks.push({ imageURL: imageUrl })
      count++;

      if (count === images.length)
        unlock();
    }

    await lock;

    res.status(200).send(imageLinks)
  }
}

const getSingleImage = async (req, res) => {
  console.log(req.params.id);
  const image = await Images.find({ image: req.params.id });
  if (image.length === 0) {
    res.status(404).json({ message: "File not found!" });
  }

  else {

    console.log(image);
    imageUrl = await getObjectSignedUrl(req.params.id);

    res.status(200).json({ imageURL: imageUrl })
  }
}

const uploadImage = async (req, res) => {
  console.log(req.file)
  const file = req.file
  // const caption = req.body.caption
  const imageName = generateFileName()

  const fileBuffer = await sharp(file.buffer)
    .resize({ height: 1920, width: 1080, fit: "contain" })
    .toBuffer()

  await uploadFile(fileBuffer, imageName, file.mimetype)

  const image = await Images.create({ image: imageName });

  res.status(201).send(image)
}

const deleteImage = async (req, res) => {
  const id = req.params.id
  const image = await Images.find({ image: id })

  console.log(image)

  if (image.length === 0) {
    console.log("hi")
    res.status(404).json({ message: "File not found!" });
    // throw new Error("File Not Found!")
  }

  else {

    console.log("hello")

    await deleteFile(id)

    await Images.deleteOne({ image: id })
    res.status(200).send(image)
  }
}

module.exports = { getAllImages, getSingleImage, uploadImage, deleteImage };