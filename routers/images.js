const express = require("express");
const router = express.Router();
const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const util = require("util");
const Multer = require("multer");
const maxSize = 2 * 1080 * 1920;
const bucket = storage.bucket("cc-lambi-private");
const bucketName = 'cc-lambi-private';
const randGen = require('./random-generator.js');

// Multer middleware configuration
let processFile = Multer({
    storage: Multer.memoryStorage(),
    limits: { fileSize: maxSize },
}).single("file");

let processFileMiddleware = util.promisify(processFile);

// push file info to Firestore with autoGen ID
async function pushFileInfo(sessionID, userID, fileName) {
    const docRef = firestore.collection('images').doc(sessionID);

    // Set the data for the document
    await docRef.set({
        userID: userID,
        fileName: [fileName],
    });

    console.log("Upload complete");
    console.log('Added document with sessionID: ', sessionID)
    return sessionID;
}

// put file info to existing array document with correct sessionID
async function putFileInfo(sessionID, fileName) {
    // Retrieve the document reference for the specified session ID
    const docRef = firestore.collection('images').doc(sessionID);

    // Get the current document data
    const docSnapshot = await docRef.get();
    if (!docSnapshot.exists) {
        console.error('Document does not exist');
        return;
    }

    // Update the 'fileName' array in the document
    const currentData = docSnapshot.data();
    const currentFileNameArray = currentData.fileName || [];
    currentFileNameArray.push(fileName);

    // Update the document with the new 'fileName' array
    await docRef.update({
        fileName: currentFileNameArray
    });
    console.log('Added document with sessionID: ', sessionID)
    return sessionID;
}

async function isSameSession(sessionID) {
    const imageRef = firestore.collection('images').doc(sessionID);

    try {
        const imageSnapshot = await imageRef.get();

        if (imageSnapshot.exists) {
            console.log("sessionID found, putting image to existing document..");
            return true;
        } else {
            console.log("sessionID not found, creating new document..");
            return false;
        }
    } catch (error) {
        console.error("Error checking sessionID:", error);
        // Handle the error as needed, e.g., throw an exception or return false
        return false;
    }
}

// function to add image to Cloud Storage and store its info on Firestore
router.route('/image/addImage')
    .get((req, res) => {
        res.status(400).json({
            status: "400",
            error: "Bad Request"
        });
    })
    .put((req, res) => {
        res.status(400).json({
            status: "400",
            error: "Bad Request"
        });
    })
    .post(async (req, res) => {
        console.log('uploading start');

        try {
            await processFileMiddleware(req, res);

            if (!req.file) {
                return res.status(400).send({
                    message: "Please upload a file!"
                });
            }

            // Generate random file name
            const fileName = randGen() + ".JPG"

            // Create a new blob in the bucket and upload the file data.
            const blob = bucket.file(fileName);
            const blobStream = blob.createWriteStream({
                resumable: false,
            });

            blobStream.on("error", (err) => {
                res.status(500).send({
                    message: err.message
                });
            });

            blobStream.on("finish", async (data) => {
                // Create URL for direct file access via HTTP.
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                const { userID, sessionID } = req.body;

                if (!userID) {
                    return res.status(400).json({
                        status: "400",
                        error: "Bad Request",
                        message: "Saving to Firestore Failed!"
                    });
                }

                if (await isSameSession(sessionID)) {
                    await putFileInfo(sessionID, fileName)
                } else{
                    await pushFileInfo(sessionID, userID, fileName)
                }
                
                // Move the pushFileInfo call inside the finish event
                // await pushFileInfo(sessionID, userID, fileName)

                // Now send the response after processing is complete
                res.status(200).send({
                    message: "Uploaded the file successfully",
                    fileName: fileName,
                    url: publicUrl,
                });
            });

            blobStream.end(req.file.buffer);
        } catch (err) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(500).send({
                    message: "File size cannot be larger than 2MB!",
                });
            }

            res.status(500).send({
                message: `Could not upload the file: ${req.file.originalname}. ${err}`,
            });
        }
    })
    .delete((req, res) => {
        res.status(400).json({
            status: "400",
            error: "Bad Request"
        });
    });

// Test randGen to generate randomName
router.route('/image/randgen').get((req, res) =>{
    const randomName = randGen();
    res.json({
        message: "success",
        randomName: randomName
    });
});

async function deleteFile(fileName){
    try {
        // Delete the object
        await storage.bucket(bucketName).file(fileName).delete();

        console.log(`Object "${fileName}" deleted successfully.`);
    } catch (error) {
        console.error('Error deleting object:', error);
    }
}

async function deleteFiles(objectNames){
    console.log("deleting files started");
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

// Export the router
module.exports = {
    router,
    deleteFile,
    deleteFiles
};