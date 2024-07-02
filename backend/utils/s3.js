import dotenv from "dotenv"
dotenv.config(); 

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"    

const bucketName = process.env.AWS_NAME
const region = process.env.REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  })

const uploadFile = async (fileBuffer, fileName, mimetype) => {
const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimetype
}

return s3Client.send(new PutObjectCommand(uploadParams));
}

const deleteFile = async (fileName) => {
const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
}

return s3Client.send(new DeleteObjectCommand(deleteParams));
}

const getObjectSignedUrl = async (key) => {
    const params = {
      Bucket: bucketName,
      Key: key
    }
  
    // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
    const command = new GetObjectCommand(params);
    const seconds = 60
    const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });
  
    return url
}



export {getObjectSignedUrl, uploadFile, deleteFile}