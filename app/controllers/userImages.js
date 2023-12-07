const { getImages, deleteImages } = require('../services/users');
const { StatusCodes } = require('http-status-codes');

const getUserImages = async (req, res, next) => {
  try {
    const result = await getImages(req);

    // Assuming you want to send the data from the snapshot in the response
    res
      .status(StatusCodes.OK)
      .json({ message: 'success to retrive all images', data: result });
  } catch (error) {
    next(error);
  }
};

const deleteUserImages = async (req, res, next) => {
  try {
    const result = await deleteImages(req);

    res.status(StatusCodes.OK).json({
      message: 'Successfully deleted files',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  deleteUserImages,
  getUserImages,
};
