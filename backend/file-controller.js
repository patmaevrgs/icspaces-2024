import dotenv from "dotenv"
dotenv.config();    
import pool from './db.js'
// import multer from 'multer'
// import { getObjectSignedUrl, uploadFile, deleteFile } from "./utils/s3.js"
import { getObjectSignedUrl, uploadFile, deleteFile } from "./utils/google-storage.js"
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import { nanoid } from 'nanoid'
import { getLocalTime } from './utils/getlocaltime.js';

const uploadRoomImage = async (req, res) => {
    let conn
    try{
        conn = await pool.getConnection()
        const file = req.file
        const { room_id } = req.body
        const imageName = nanoid(32)

        //with processing
        // const fileBuffer = await sharp(file.buffer)
        // .resize({ height: 1920, width: 1080, fit: "contain" })
        // .toBuffer()

        //without processing
        const fileBuffer = file.buffer

        const response = await uploadFile(fileBuffer, imageName, file.mimetype)
        await conn.beginTransaction()
        //save to SQL database
        if (response.success) {
            const date_created = new Date()
            const formattedDate = getLocalTime()

            const insertQuery = "INSERT INTO room_file(room_id, file_path, date_created) VALUES (?,?,?)"
            await conn.query(insertQuery,[room_id, imageName, formattedDate])
            await conn.commit()
            res.send({success:true, id: imageName, msg:"Successfully added"})
        }else{
            await conn.rollback()
            res.send({success:false, msg:"Server Error: Cannot upload image"})
        }
        
    }catch(e){
        await conn.rollback()
        console.log(`Failed to upload: ${e}`)
        res.send({success:false, msg:"Server Error: Cannot upload image"})
    }finally{
        if (conn) conn.release();
    } 
}

//images is ordered by latest to oldest
const getRoomImage = async (req,res) => { 
    let conn
    try{
        conn = await pool.getConnection()
        const { room_id } = req.body

        //get all room images
        const getQuery = "SELECT * FROM room_file WHERE room_id = ? ORDER BY date_created DESC"
        const images = await conn.query(getQuery,[room_id])
        let listOfImages = []

        for (let image of images){
            console.log(image)
            let url = await getObjectSignedUrl(image.file_path)
            listOfImages.push({id:image.file_path, url: url.url})
        }
        res.send({success:true, images: listOfImages})
    }catch(err){
        console.log(`Failed to get: ${err}`)
        res.send({success:false, msg:"Server Error: Cannot get images"})
    }finally{
        if (conn) conn.release();
    } 
}

const deleteRoomImage = async (req, res) => {
    let conn
    try{
        conn = await pool.getConnection()
        const { file_id } = req.body

        await conn.beginTransaction()
        
        const response = await deleteFile(file_id)
        
        if (response.success){
            //delete from SQL database
            const deleteQuery = "DELETE FROM room_file WHERE file_path = ?"
            await conn.query(deleteQuery,[ file_id ])
            await conn.commit()
            res.send({success:true, msg:"Successfully deleted"})
        }else{
            await conn.rollback()
            res.send({success:false, msg:"Server Error: Cannot delete image"})
        }
    }catch(err){
        await conn.rollback()
        console.log(`Failed to delete: ${err}`)
        res.send({success:false, msg:"Server Error: Cannot delete image"})
    }
}

// Make sure reservation exists before uploading a document
const uploadReservationDocument = async (req, res) => {
    let conn
    try{
        conn = await pool.getConnection()
        const file = req.file
        const { reservation_id, type } = req.body // type: payment or letter
        const fileName = nanoid(32)

        //without processing
        const fileBuffer = file.buffer

        await uploadFile(fileBuffer, fileName, file.mimetype)
        //save to SQL database
        await conn.beginTransaction()

        // Ensure reservation exists
        const [reservation] = await conn.query("SELECT * FROM reservation WHERE reservation_id = ?", [reservation_id]);
        if (reservation.length === 0) {
            res.send({ success: false, msg: "Reservation not found" });
            return;
        }
        
        //add distinction between proof of payment and letter
        if (type === 'payment') {
            // check if already present 
            const existingPayments = conn.query("SELECT * FROM file WHERE reservation_id = ? AND file_type = ?",[reservation_id, 0])

            if (existingPayments.length > 0) {
                // If a payment proof is already present, return an error message
                res.send({ success: false, msg: "Proof of payment already exists for this reservation. Delete existing document first" });
            } else {
                const date_created = new Date()
                const formattedDate = getLocalTime()

                // Insert new payment proof document
                const insertQuery = "INSERT INTO file(reservation_id, file_path, file_type, date_created) VALUES (?,?,?,?)";
                await conn.query(insertQuery, [reservation_id, fileName, 0, formattedDate]);
                await conn.commit();
                res.send({ success: true, msg: "Successfully added: proof of payment document" });
            }
        }else if (type === 'letter') {
            // check if already present 
            const existingLetters = conn.query("SELECT * FROM file WHERE reservation_id = ? AND file_type = ?",[reservation_id, 0])
            // insert 
            if (existingLetters.length > 0) {
                // If already present, return an error message
                res.send({ success: false, msg: "Activity Letter already exists for this reservation. Delete existing document first" });
            } else {
                const date_created = new Date()
                const formattedDate = getLocalTime()

                // Insert new payment proof document
                const insertQuery = "INSERT INTO file(reservation_id, file_path, file_type, date_created) VALUES (?,?,?,?)";
                await conn.query(insertQuery, [reservation_id, fileName, 1, formattedDate]);
                await conn.commit();
                res.send({ success: true, msg: "Successfully added: activity letter document" });
            }
        }else{
            await conn.rollback()
            res.send({success:false, msg:"Invalid type"})
        }
        
    }catch(e){
        await conn.rollback()
        console.log(`Failed to upload: ${e}`)
        res.send({success:false, msg:"Server Error: Cannot upload file"})
    }finally{
        if (conn) conn.release();
    } 
}

const getReservationDocument = async (req, res) => {
    let conn
    try{
        conn = await pool.getConnection()
        const { reservation_id } = req.body

        let returnedPaymentDoc  = ""
        let returnedLetterDoc = ""

        //get payment
        const getPaymentQuery = "SELECT * FROM file WHERE reservation_id = ? AND file_type = ?"
        const [paymentDoc] = await conn.query(getPaymentQuery,[reservation_id, 0])
    
        if (paymentDoc) {
            let paymentDocUrl = await getObjectSignedUrl(paymentDoc.file_path)
            returnedPaymentDoc = {id: paymentDoc.file_path, url:paymentDocUrl.url}
        }
        //get letter
        const getLetterQuery = "SELECT * FROM file WHERE reservation_id = ? AND file_type = ?"
        const [letterDoc] = await conn.query(getLetterQuery,[reservation_id, 1])
        
        if (letterDoc) {
            let letterDocUrl = await getObjectSignedUrl(letterDoc.file_path)
            returnedLetterDoc = {id: letterDoc.file_path, url:letterDocUrl.url}
        }

        res.send({success:true, payment: returnedPaymentDoc, letter: returnedLetterDoc})     
    }catch(err){
        console.log(`Failed to get: ${err}`)
        res.send({success:false, msg:"Server Error: Cannot get documents"})
    }finally{
        if (conn) conn.release();
    } 
}

const deleteReservationDocument = async (req, res) => {
    let conn
    try{
        conn = await pool.getConnection()
        const { file_id } = req.body

        await conn.beginTransaction()
        
        const response = await deleteFile(file_id)
        
        if (response.success){
            //delete from SQL database
            const deleteQuery = "DELETE FROM file WHERE file_path = ?"
            await conn.query(deleteQuery,[ file_id ])
            await conn.commit()
            res.send({success:true, msg:"Successfully deleted"})
        }else{
            await conn.rollback()
            res.send({success:false, msg:"Server Error: Cannot delete document"})
        }
    }catch(err){
        await conn.rollback()
        console.log(`Failed to delete: ${err}`)
        res.send({success:false, msg:"Server Error: Cannot delete document"})
    }
}


export {uploadRoomImage, getRoomImage, deleteRoomImage, uploadReservationDocument, getReservationDocument, deleteReservationDocument}