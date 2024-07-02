import dotenv from "dotenv"
dotenv.config(); 

import { Storage } from '@google-cloud/storage';

const storage = new Storage();
const bucketName = 'icspaces-files';

const uploadFile = async (fileBuffer, fileName, mimetype) => {

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    try {
        await file.save(fileBuffer, {
            metadata: { contentType: mimetype },
            resumable: false
        });
        console.log(`${fileName} uploaded to ${bucketName}.`);
        return { success: true };
    } catch (error) {
        console.error('Error uploading file:', error);
        return { success: false, error: `Failed to upload file: ${error.message}` };
    }
}

const deleteFile = async (fileName) => {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    try {
        await file.delete();
        console.log(`${fileName} deleted from ${bucketName}.`);
        return { success: true };
    } catch (error) {
        console.error('Error deleting file:', error);
        return { success: false, error: `Failed to delete file: ${error.message}` };
    }
};

const getObjectSignedUrl = async (fileName) => {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    try {
        const [url] = await file.getSignedUrl(options);
        // console.log(`The signed URL for ${fileName} is ${url}.`);
        return { success: true, url };
    } catch (error) {
        console.error('Error generating signed URL:', error);
        return { success: false, error: `Failed to generate signed URL: ${error.message}` };
    }
};

const getEmailFlair = async (fileName) => {
    const bucket = storage.bucket(bucketName);
    const directory = "/assets/email/"
    const file = bucket.file(`${directory}${fileName}`);
    

    const options = {
        version: 'v4',
        action: 'read',
        // expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    try {
        const [url] = await file.getSignedUrl(options);
        // console.log(`The signed URL for ${fileName} is ${url}.`);
        return { success: true, url };
    } catch (error) {
        console.error('Error generating signed URL:', error);
        return { success: false, error: `Failed to generate signed URL: ${error.message}` };
    }
};

export { uploadFile, deleteFile, getObjectSignedUrl, getEmailFlair};

