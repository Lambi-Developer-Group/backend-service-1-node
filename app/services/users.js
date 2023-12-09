const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();
const { deleteFiles } = require('../services/images');
const { NotFound } = require('../errors');

const getAll = async () => {
  const ref = firestore.collection('users');
  const snapshot = await ref.get();

  if (snapshot.empty) {
    console.log('No matching documents.');
    throw new NotFound('No matching document.');
  }

  let result = snapshot.docs.map((doc) => doc.data());
  return result;
};

const getSpesific = async (req) => {
  const userID = req.params.id;
  const ref = firestore.collection('users').doc(userID);
  const snapshot = await ref.get();

  if (!snapshot.exists) {
    console.log('No matching document.');
    throw new NotFound('No matching document.');
  }

  // Assuming you want to send the data from the snapshot in the response
  let result = snapshot.data();
  return result;
};

const getImages = async (req) => {
  const userID = req.params.id;
  const ref = firestore.collection('images');
  const snapshot = await ref.where('userID', '==', userID).get();

  // Extract the fileNames from the snapshot
  const fileNames = [];
  snapshot.forEach((doc) => {
    const filename = doc.data().fileName;
    fileNames.push(filename);
  });

  // Assuming you want to send the data from the snapshot in the response
  return fileNames;
};

const deleteImages = async (req) => {
  const userID = req.params.id;
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

  return fileNames;
};

module.exports = {
  getAll,
  getSpesific,
  getImages,
  deleteImages,
};
