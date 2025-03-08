import { Storage } from '@google-cloud/storage';

async function uploadToGCS(bucketName, sourceFileName, destinationBlobName, keyFilePath) {
    """Uploads a file to Google Cloud Storage."""
    // Initialize a storage client with credentials
    const storage = new Storage({ keyFilename: keyFilePath });
    
    // Get the bucket
    const bucket = storage.bucket(bucketName);
    
    // Upload the file
    await bucket.upload(sourceFileName, {
        destination: destinationBlobName,
    });
    
    console.log(`File ${sourceFileName} uploaded to ${destinationBlobName} in bucket ${bucketName}.`);
}

// Example usage
(async () => {
    const bucketName = "your-bucket-name";  // Replace with your bucket name
    const sourceFileName = "path/to/your/local/file.txt";  // Replace with the file you want to upload
    const destinationBlobName = "uploaded-file.txt";  // Replace with the desired destination name in GCS
    const keyFilePath = "path/to/your-service-account.json";  // Path to service account key file
    
    await uploadToGCS(bucketName, sourceFileName, destinationBlobName, keyFilePath);
})();
