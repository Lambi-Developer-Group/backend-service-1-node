const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();
const { deleteFiles } = require('../services/images');
const bcrypt = require('bcryptjs');

const getUserImages = async (req, res, next) => {
  const userID = req.params.id;
  try {
    const ref = firestore.collection('images');
    const snapshot = await ref.where('userID', '==', userID).get();

    // Extract the fileNames from the snapshot
    const fileNames = [];
    snapshot.forEach((doc) => {
      const filename = doc.data().fileName;
      fileNames.push(filename);
    });

    // Assuming you want to send the data from the snapshot in the response
    res.json(fileNames);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    next(error);
  }
};

const deleteUserImages = async (req, res) => {
  const userID = req.params.id;
  try {
    const ref = firestore.collection('images');
    const snapshot = await ref.where('userID', '==', userID).get();

    // Extract the fileNames from the snapshot
    const fileNames = [];
    snapshot.forEach((doc) => {
      const filename = doc.data().fileName;
      fileNames.push(filename);

      // Delete the document from Firestore
      const docRef = ref.doc(doc.id);
      docRef.delete();
    });

    // delete object based on fileNames
    await deleteFiles(fileNames);

    res.json({
      message: 'Successfully deleted files',
      fileNames: fileNames,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    next(error);
  }
};

module.exports = {
  deleteUserImages,
  getUserImages,
};
