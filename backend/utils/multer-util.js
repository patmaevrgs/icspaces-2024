import multer from 'multer'
import dotenv from "dotenv"
dotenv.config();    

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const multerVerify = async (req, res, next) => {
    // Multer-specific error handling
    if (req.fileValidationError) {
        return res.status(400).send({ success: false, msg: req.fileValidationError });
    }
    if (!req.file) {
        return res.status(400).send({ success: false, msg: "No file uploaded" });
    }
    if (req.file.size > process.env.FILE_SIZE_LIMIT) { //10 MB limit = 10 * 1024 * 1024
        return res.status(400).send({ success: false, msg: "File size exceeds limit" });
    }
    next();
}

export { storage, upload, multerVerify }
