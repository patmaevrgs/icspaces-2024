import dotenv from "dotenv"
dotenv.config()
import pool from "./db.js"

import { v4 as uuidv4 } from 'uuid'
import { nanoid } from "nanoid"
import nodemailer from 'nodemailer'
import { getLocalTime } from './utils/getlocaltime.js';

import { addGuestReservationNotification ,addGuestReservationStatusChangeNotification } from "./notifications-controller.js"

let configMailerOptions = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_EMAIL, // Your Gmail address
        pass: process.env.SMTP_APP_PASSWORD // Your App Password
    }
}

const addGuestReservation = async (req, res) => {
    let conn
    try {
        conn = await pool.getConnection()
        const { fname, lname, email, admin_id, activity_name, activity_desc, room_id, start_datetime, end_datetime, discount, additional_fee, total_amount_due, status_code, utilities } = req.body
        
        await conn.beginTransaction();
        //Add guest with new transactionid
        // const transaction_id = uuidv4()
        const transaction_id = nanoid(32)
        const addGuestResult = await conn.query(`INSERT INTO guest(transaction_id, reservation_id, fname, lname, email) VALUES(?,?,?,?,?)`,[transaction_id, null, fname, lname, email])

        const date_created = new Date()
        const formattedDate = getLocalTime()

        var query = `INSERT INTO reservation(
            activity_name,
            activity_desc, 
            room_id, 
            user_id,
            date_created, 
            start_datetime,
            end_datetime,
            discount,
            additional_fee,
            total_amount_due,
            status_code
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [activity_name, activity_desc, room_id, admin_id, formattedDate, start_datetime, end_datetime, discount, additional_fee, total_amount_due, status_code]
        
        // Execute query
        const result = await conn.query(query, values)
        const res_id = typeof(result.insertId) === "bigint" ? result.insertId.toString() : result.insertId;
        // console.log(utilities)
        // console.log(utilities.length)
        // let utilityList = JSON.parse(utilities)
        let utilityList = utilities
        // console.log(utilityList)

        //insert utilities if there is any
        if (utilityList.length !== 0) {
            for (const utility of utilityList) {
                const { utility_id, reserved_quantity, running_total } = utility;
                const utilityInsertQuery = `INSERT INTO reservation_utility(reservation_id, utility_id, reserved_quantity, running_total) VALUES(?,?,?,?)`;
                const utilityInsertValues = [result.insertId, utility_id, reserved_quantity, running_total];
                await conn.query(utilityInsertQuery, utilityInsertValues);
            }
        }
        // update guest reservation id
        const updateGuestResult = await conn.query(`UPDATE guest SET reservation_id = ? WHERE transaction_id = ?`,[result.insertId, transaction_id])
        
        // Insert into reservation_notification table and get the reservation_id from previous query
        const insertnotifResult = await conn.query(`INSERT INTO reservation_notification(reservation_id, actor_id, status_code, date_created) VALUES(?,?,?,?)`, [result.insertId, admin_id, status_code, formattedDate])

        //add nodemailer here to mail the appropriate guest
        addGuestReservationNotification(admin_id, transaction_id, conn)

        await conn.commit();

        res.send({success:true, transaction_id: transaction_id, reservation_id: res_id, message: "Successfully added Guest reservation." })
    } catch (err) {
        console.log(err);
        await conn.rollback();
        res.send({errmsg: "Failed to add reservation", success: false });
    } finally {
        if (conn) conn.release();
    }
}

const setGuestAsApproved = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        // user_id is the id of the admin who changed the status of the reservation
        const { reservation_id, user_id } = req.body
        const query = "UPDATE reservation SET status_code = 1 WHERE reservation_id = ?";
        const values = [reservation_id];

        //execute query
        await conn.query(query, values);

        const date_created = new Date()
        const formattedDate = getLocalTime()

        // Insert into reservation_notification table
        const notifQuery = `INSERT INTO reservation_notification(reservation_id, actor_id, status_code) VALUES(?,?,1,?)`;
        const notifValues = [reservation_id, user_id, formattedDate];
        await conn.query(notifQuery, notifValues);
        // get transaction id based on reservation_id
        const [transactionIdRes] = await conn.query("SELECT transaction_id FROM guest WHERE reservation_id = ?", [reservation_id])
        const transaction_id = transactionIdRes.transaction_id;
        console.log(transaction_id);

        await addGuestReservationStatusChangeNotification(user_id, transaction_id, conn);

        await conn.commit();
        res.send({ message: "Successfully edited status to approved." });
    } catch (err) {
        console.log(err)
        await conn.rollback();
        res.send({errmsg: "Failed to set reservation as approved", success: false });
        
    } finally {
        if (conn) conn.release();
    }
}

const setGuestAsPaid = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        // user_id is the id of the admin who changed the status of the reservation
        const { reservation_id, user_id } = req.body
        const query = "UPDATE reservation SET status_code = 2 WHERE reservation_id = ?";
        const values = [reservation_id];

        //execute query
        await conn.query(query, values);

        const date_created = new Date()
        const formattedDate = getLocalTime()

        // Insert into reservation_notification table
        const notifQuery = `INSERT INTO reservation_notification(reservation_id, actor_id, status_code) VALUES(?,?,2,?)`;
        const notifValues = [reservation_id, user_id, formattedDate];
        await conn.query(notifQuery, notifValues);
        // get transaction id based on reservation_id
        const [transactionIdRes] = await conn.query("SELECT transaction_id FROM guest WHERE reservation_id = ?", [reservation_id])
        const transaction_id = transactionIdRes.transaction_id;
        console.log(transaction_id);

        await addGuestReservationStatusChangeNotification(user_id, transaction_id, conn);

        await conn.commit();
        res.send({ message: "Successfully edited status to approved." });
    } catch (err) {
        console.log(err)
        await conn.rollback();
        res.send({errmsg: "Failed to set reservation as approved", success: false });
        
    } finally {
        if (conn) conn.release();
    }
}

const setGuestAsDisapproved = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        // user_id is the id of the admin who changed the status of the reservation
        const { reservation_id, user_id } = req.body
        const query = "UPDATE reservation SET status_code = 3 WHERE reservation_id = ?";
        const values = [reservation_id];

        //execute query
        await conn.query(query, values);

        const date_created = new Date()
        const formattedDate = getLocalTime()

        // Insert into reservation_notification table
        const notifQuery = `INSERT INTO reservation_notification(reservation_id, actor_id, status_code) VALUES(?,?,3,?)`;
        const notifValues = [reservation_id, user_id, formattedDate];
        await conn.query(notifQuery, notifValues);
        // get transaction id based on reservation_id
        const [transactionIdRes] = await conn.query("SELECT transaction_id FROM guest WHERE reservation_id = ?", [reservation_id])
        const transaction_id = transactionIdRes.transaction_id;
        console.log(transaction_id);

        await addGuestReservationStatusChangeNotification(user_id, transaction_id, conn);

        await conn.commit();
        res.send({ message: "Successfully edited status to approved." });
    } catch (err) {
        console.log(err)
        await conn.rollback();
        res.send({errmsg: "Failed to set reservation as approved", success: false });
        
    } finally {
        if (conn) conn.release();
    }
}

const setGuestAsCancelled = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        // user_id is the id of the admin who changed the status of the reservation
        const { reservation_id, user_id } = req.body
        const query = "UPDATE reservation SET status_code = 4 WHERE reservation_id = ?";
        const values = [reservation_id];

        //execute query
        await conn.query(query, values);

        const date_created = new Date()
        const formattedDate = getLocalTime()

        // Insert into reservation_notification table
        const notifQuery = `INSERT INTO reservation_notification(reservation_id, actor_id, status_code, date_created) VALUES(?,?,4,?)`;
        const notifValues = [reservation_id, user_id, formattedDate];
        await conn.query(notifQuery, notifValues);
        // get transaction id based on reservation_id
        const [transactionIdRes] = await conn.query("SELECT transaction_id FROM guest WHERE reservation_id = ?", [reservation_id])
        const transaction_id = transactionIdRes.transaction_id;
        console.log(transaction_id);

        await addGuestReservationStatusChangeNotification(user_id, transaction_id, conn);

        await conn.commit();
        res.send({ message: "Successfully edited status to approved." });
    } catch (err) {
        console.log(err)
        await conn.rollback();
        res.send({errmsg: "Failed to set reservation as approved", success: false });
        
    } finally {
        if (conn) conn.release();
    }
}

const trackGuestReservation = async (req, res) => {
    let conn
    try{
        conn = await pool.getConnection();
        const { transaction_id } = req.body;
        await conn.beginTransaction();
        
        const guests = await conn.query("SELECT * FROM guest WHERE transaction_id = ?", [transaction_id]);

        console.log(transaction_id, guests)

        if (guests.length === 0){
            res.send({status: false, msg: "Reservation not found"})
        }else{
            const [resdetails] = await conn.query("SELECT * FROM reservation WHERE reservation_id = ?", [guests[0].reservation_id])
            const comments = await conn.query("SELECT * FROM comment WHERE reservation_id = ?",[resdetails.reservation_id])
            res.send({status: true, data: resdetails, comments: comments})
        }
        await conn.commit();
        
    }catch(e){
        await conn.rollback();
        console.log(`Error: ${e}`)
        res.send({errmsg: "Server Error: Failed to get Reservation", success: false });
    }finally {
        if (conn) conn.release();
    }
}

export { addGuestReservation, trackGuestReservation, setGuestAsApproved, setGuestAsPaid, setGuestAsDisapproved, setGuestAsCancelled }