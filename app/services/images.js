const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const bucketName = 'cc-lambi-private';
const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();
const util = require('util');
const Multer = require('multer');
const maxSize = 2 * 1080 * 1920;
const bucket = storage.bucket('cc-lambi-private');
const randGen = require('../services/random-generator');

const { BadRequest } = require('../errors');

async function deleteFile(fileName) {
  try {
    // Delete the object
    await storage.bucket(bucketName).file(fileName).delete();

    console.log(`Object "${fileName}" deleted successfully.`);
  } catch (error) {
    console.error('Error deleting object:', error);
  }
}

async function deleteFiles(objectNames) {
  console.log('deleting files started');
  try {
    // Delete multiple objects
    const deletePromises = objectNames.map(async (fileName) => {
      await storage.bucket(bucketName).file(fileName).delete();
      console.log(`Object "${fileName}" deleted successfully.`);
    });

    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting object:', error);
  }
}

// Multer middleware configuration
let processFile = Multer({
  storage: Multer.memoryStorage(),
  limits: { fileSize: maxSize },
}).single('file');

let processFileMiddleware = util.promisify(processFile);

// push file info to Firestore with autoGen ID
async function pushFileInfo(publicUrl, color, fileName) {
  try {
    const timestamp = Date.now();
    const date = new Date(timestamp);
    const formattedDate = date.toISOString();

    const imageEntry = {
      color: color,
      publicUrl: publicUrl,
    };

    const documentData = {
      createdAt: formattedDate,
      images: {
        [fileName]: imageEntry,
      },
    };

    const res = await firestore.collection('images').add(documentData);

    console.log('Added image collection on images with Firestore ID: ', res.id);
    return res.id;
  } catch (error) {
    console.error(error);
    throw new BadRequest('Internal Server Error');
  }
}

// push file info to current sessionID
async function pushSessionFileInfo(sessionID, imageID) {
  try {
    const docRef = firestore.collection('sessions').doc(sessionID);

    await docRef.set({
      imageID: imageID,
    }, { merge: true });

    console.log('Added imageID on session: ', sessionID);
    return sessionID;
  } catch (error) {
    console.error(error);
    throw new BadRequest('Internal Server Error');
  }
}

// put file info to existing array document with correct sessionID
async function putFileInfo(sessionID, publicUrl, color, fileName) {
  try {
    const docRef = firestore.collection('sessions').doc(sessionID);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      throw new BadRequest('Session not found');
    }

    const sessionData = docSnapshot.data();
    const imageID = sessionData.imageID;

    if (!imageID) {
      throw new BadRequest('Fatal, ImageID not found in session');
    }

    const timestamp = Date.now();
    const date = new Date(timestamp);
    const formattedDate = date.toISOString();

    const imageEntry = {
      color: color,
      publicUrl: publicUrl,
    };

    const documentData = {
      createdAt: formattedDate,
      images: {
        [fileName]: imageEntry,
      },
    };

    const imageDocRef = firestore.collection('images').doc(imageID);

    // Use set to update the existing document or create a new one if it doesn't exist
    await imageDocRef.set(documentData, { merge: true });

    console.log('Added image collection on images with Firestore ID: ', imageID);
    return imageID;
  } catch (error) {
    console.error(error);
    throw new BadRequest('Internal Server Error');
  }
}

async function isSameSession(sessionID) {
  try {
    const sessionRef = firestore.collection('sessions').doc(sessionID);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      throw new BadRequest('Session not found');
    } else {
      console.log('Session found based on sessionID');
      
      const sessionData = sessionDoc.data();
      
      const hasImage = sessionData.hasOwnProperty('imageID');

      if (hasImage) {
        console.log('Session has imageID');
        return true;
      } else {
        console.log('Session does not have imageID. Creating imageID..');
        return false;
      }
    }
  } catch (error) {
    console.error(error);
    throw new BadRequest('Internal Server Error');
  }
}

async function isSameImageDocument(sessionID) {
  const imageRef = firestore.collection('images').doc(sessionID);

  try {
    const imageSnapshot = await imageRef.get();

    if (imageSnapshot.exists) {
      console.log('sessionID found, putting image to existing document..');
      return true;
    } else {
      console.log('sessionID not found, creating new document..');
      return false;
    }
  } catch (error) {
    console.error('Error checking sessionID:', error);
    // Handle the error as needed, e.g., throw an exception or return false
    return false;
  }
}

const getAllImages = async () => {
  const ref = firestore.collection('images');
  const snapshot = await ref.get();

  // Extract the fileNames from the snapshot
  const fileNames = [];
  snapshot.forEach((doc) => {
    const filename = doc.data().fileName;
    fileNames.push(filename);
  });

  // Assuming you want to send the data from the snapshot in the response
  return fileNames;
};

// function to add image to Cloud Storage and store its info on Firestore
const addImageInBucketAndFirestore = async (req, res) => {
  console.log('uploading file to bucket started');

  await processFileMiddleware(req, res);

  if (!req.file) {
    throw new BadRequest('Please upload a file!');
  }

  // Generate random file name
  const fileName = randGen() + '.JPG';

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on('error', (err) => {
    res.status(500).send({
      message: err.message,
    });
  });

  blobStream.on('finish', async (data) => {
    // Create URL for direct file access via HTTP.
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    const { sessionID, color } = req.body;

    if (await isSameSession(sessionID)) {
      const imageID = await putFileInfo(sessionID, publicUrl, color, fileName);
      const result = { imageID, fileName, publicUrl };
      return result;
    } else {
      const imageID = await pushFileInfo(publicUrl, color, fileName);
      await pushSessionFileInfo(sessionID, imageID)
      const result = { imageID, fileName, publicUrl };
      return result;
    }
  });

  blobStream.end(req.file.buffer);
};

// Export the router
module.exports = {
  deleteFile,
  deleteFiles,
  getAllImages,
  addImageInBucketAndFirestore,
};
