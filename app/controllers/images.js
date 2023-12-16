const { StatusCodes } = require('http-status-codes');
const { addImagesToBucket, getAllImages } = require('../services/images');

const getAllBucketImages = async (req, res, next) => {
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
const addImages = async (req, res, next) => {
  try {
    const result = await addImagesToBucket(req, res);

    res
      .status(StatusCodes.CREATED)
      .json({ message: 'success to upload images', data: result });
    res.json({ message: 'debugging bang' });
  } catch (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).send({
        message: 'File size cannot be larger than 2MB!',
      });
    }
    next(err);
  }
};

module.exports = {
  getAllBucketImages,
  addImages,
};
