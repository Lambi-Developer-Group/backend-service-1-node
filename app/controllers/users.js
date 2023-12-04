const express = require('express');
const router = express.Router();
const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();
const imageHandler = require('./images');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res, next) => {
  try {
    const ref = firestore.collection('users');
    const snapshot = await ref.get();

    if (snapshot.empty) {
      console.log('No matching documents.');
      return res.status(404).json({ error: 'No matching documents.' });
    }

    res.json(snapshot.docs.map((doc) => doc.data()));
  } catch (error) {
    // console.error('Error getting documents', error);
    res.status(500).json({ error: 'Internal Server Error' });
    next(error);
  }
};

const getSpesificUser = async (req, res, next) => {
  const userID = req.params.id;
  try {
    const ref = firestore.collection('users').doc(userID);
    const snapshot = await ref.get();

    if (!snapshot.exists) {
      console.log('No matching document.');
      return res.status(404).json({ error: 'No matching document.' });
    }

    // Assuming you want to send the data from the snapshot in the response
    res.json(snapshot.data());
  } catch (error) {
    // console.error('Error getting document', error);
    res.status(500).json({ error: 'Internal Server Error' });
    next(error);
  }
};

module.exports = {
  getUsers,
  getSpesificUser,
};
