const { StatusCodes } = require('http-status-codes');
const { addImageInBucketAndFirestore, getAllImages } = require('../services/images');

const getAllBucketImages = async (req, res) => {
  try {
    const result = await getAllImages();

    // Assuming you want to send the data from the snapshot in the response
    res
      .status(StatusCodes.OK)
      .json({ message: 'success to retrive all images', data: result });
  } catch (error) {
    next(error);
  }
};

// function to add image to Cloud Storage and store its info on Firestore
const addImage = async (req, res, next) => {
  try {
    console.log('uploading start');
    const result = await addImageInBucketAndFirestore(req);

    res
      .status(StatusCodes.CREATED)
      .json({ message: 'success to upload images', data: result });
  } catch (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(500).send({
        message: 'File size cannot be larger than 2MB!',
      });
    }
    next(err);
  }
};

module.exports = {
  getAllBucketImages,
  addImage,
};
