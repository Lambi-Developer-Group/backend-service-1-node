const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();
const bcrypt = require('bcryptjs');
const { BadRequest } = require('../errors');

// [async function way] push user creds to Firestore with autoGen ID
async function pushUser(firstName, lastName, age, password, email) {
  const timestamp = Date.now();
  const date = new Date(timestamp);
  const formattedDate = date.toISOString();
  const res = await firestore.collection('users').add({
    firstName: firstName,
    lastName: lastName,
    age: age,
    password: password,
    createdAt: formattedDate,
    email: email,
  });
  console.log('Added document with ID: ', res.id);
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

const login = async (req) => {
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
};
