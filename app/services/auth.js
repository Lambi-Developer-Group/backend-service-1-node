const { Firestore } = require('@google-cloud/firestore');
const {OAuth2Client} = require('google-auth-library');
const firestore = new Firestore();
const bcrypt = require('bcryptjs');
const { BadRequest } = require('../errors');
const axios = require('axios');

// [async function way] push user creds to Firestore with autoGen ID
async function pushUser(name, locale, email) {
  const timestamp = Date.now();
  const date = new Date(timestamp);
  const formattedDate = date.toISOString();
  const res = await firestore.collection('users').add({
    name: name,
    email: email,
    createdAt: formattedDate,
    locale: locale,
  });
  console.log('Added user with Firestore ID: ', res.id);
  return;
}

async function pushToken(token) {
  const timestamp = Date.now();
  const date = new Date(timestamp);

  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  };

  const formattedDate = date.toLocaleString('en-US', options);
  const res = await firestore.collection('tokens').add({
    token: token,
    createdAt: formattedDate,
  });
  console.log('Added token with FirestoreID: ', res.id);
  return res.id;
}

// Hash Password with bcrypt
async function hashPassword(password) {
  const saltRounds = 10; // Adjust the saltRounds value as needed
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

const register = async (req) => {
  console.log('user add start');

  const { firstName, lastName, age, password, email } = req.body;

  // Check if required data is provided
  if (!firstName || !lastName || !age || !password || !email) {
    throw new BadRequest('Bad Request, Please fill all the required Field');
  }

  const hashedPassword = await hashPassword(password);
  const userID = await pushUser(
    firstName,
    lastName,
    age,
    hashedPassword,
    email
  );

  return userID;
};

//added test
const test = async (req) => {
  console.log('Response: test');
  return "Test Successful"
};

const submitToken = async (req) => {
  const { token } = req.body;

  if (!token) {
    throw new BadRequest('Bad Request, Please fill all the required Field');
  }

  tokenOnDocument = await pushToken(token)
  return tokenOnDocument
};

const login = async (req) => {
  const { token } = req.body;
  console.log('login started');

  if (!token) {
    throw new BadRequest('Bad Request, Please fill all the required Field');
  }

  try {
    // Make a request to the Google API with the provided token
    const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    const { email, name, locale} = response.data;

    const userRef = firestore.collection('users').where('email', '==', email);
    const userSnapshot = await userRef.get();
  
    if (userSnapshot.empty) {
      console.log('Email not found on Firestore. Creating new User in Firestore...');
      await pushUser(name, locale, email);
    }else{
      console.log('Email found on Firestore. Login in...');
      return email;
    }
    return email;
  } catch (error) {
    console.log(error);
    throw new BadRequest('Internal Server Error');
  }
  return ;
};

const loginDump = async (req) => {
  const { email, password } = req.body;
  console.log('login started', email);

  const userRef = firestore.collection('users').where('email', '==', email);
  const userSnapshot = await userRef.get();

  if (userSnapshot.empty) {
    console.log('field empty!');
    throw new BadRequest('Wrong email or password');
  }

  const userData = userSnapshot.docs[0].data();
  const isPasswordValid = await bcrypt.compare(
    password.toString(),
    userData.password.toString()
  );

  if (isPasswordValid) {
    console.log('login accepted');
    return userData;
  } else {
    console.log('login rejected');
    throw new BadRequest('Wrong email or password');
  }
};

module.exports = {
  pushUser,
  hashPassword,
  register,
  login,
  //added test
  test,
  submitToken,
};
