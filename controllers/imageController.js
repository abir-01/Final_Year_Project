const { uploadFile, deleteFile, getObjectSignedUrl } = require('../s3.js');

const sharp = require('sharp');
const crypto = require('crypto');
const Images = require('../models/imageModel.js');



const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

function newLock() {
  var unlock, lock = new Promise((res, rej) => { unlock = res; });
  return [lock, unlock];
}

const getAllImages =  async (req, res) => {
  const images = await Images.find({});
  // console.log(images);

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

const getSingleImage = async (req, res) => {

  imageUrl = await getObjectSignedUrl(req.params.id);
  res.status(200).json({ imageURL: imageUrl })
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
  const image = await Images.find({image:id})

  await deleteFile(id)

  await Images.deleteOne({id:image.id})
  res.send(image)
}

module.exports = {getAllImages,getSingleImage,uploadImage,deleteImage};