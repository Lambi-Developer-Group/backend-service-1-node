const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const bucketName = 'cc-lambi-private';

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

// Export the router
module.exports = {
  deleteFile,
  deleteFiles,
};
