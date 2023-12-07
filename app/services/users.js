const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();
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

module.exports = {
  getAll,
  getSpesific,
};
