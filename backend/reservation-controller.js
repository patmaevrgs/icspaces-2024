import pool from './db.js';
import {addReservationStatusChangeNotification, addUserStatusChangeNotification, addReservationCommentNotification, addReservationNotification} from "./notifications-controller.js"
import { getLocalTime } from './utils/getlocaltime.js';

// gets all the reservations using user_id
// input: "user_id"
const getAllReservationsByUser = async (req, res) => {
    let conn;
    const { user_id } = req.body;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        console.log("User ID received:", user_id);
        const query = "SELECT * FROM reservation WHERE user_id = ?";
        const values = [user_id];
        const rows = await conn.query(query, values);
        console.log(rows)
        await conn.commit();
        res.send(rows);
    } catch (err) {
        
        await conn.rollback();
        res.send({errmsg: "Failed to get all reservations by User ID", success: false });
        
    } finally {
        if (conn) conn.release();
    }
}

const getReservation = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        const { reservation_id } = req.body;
        const query = `
            SELECT 
                reservation.*, 
                IFNULL(comment.comment_text, '') AS comment_text,
                room.fee,
                IFNULL(pending.date_created, '') AS pending_date,
                IFNULL(booked.date_created, '') AS booked_date,
                IFNULL(paid.date_created, '') AS paid_date,
                IFNULL(disapproved.date_created, '') AS disapproved_date,
                IFNULL(cancelled.date_created, '') AS cancelled_date
            FROM reservation 
            LEFT JOIN comment ON reservation.reservation_id = comment.reservation_id 
            INNER JOIN room ON reservation.room_id = room.room_id
            LEFT JOIN reservation_notification AS pending ON reservation.reservation_id = pending.reservation_id AND pending.status_code = 0
            LEFT JOIN reservation_notification AS booked ON reservation.reservation_id = booked.reservation_id AND booked.status_code = 1
            LEFT JOIN reservation_notification AS paid ON reservation.reservation_id = paid.reservation_id AND paid.status_code = 2
            LEFT JOIN reservation_notification AS disapproved ON reservation.reservation_id = disapproved.reservation_id AND disapproved.status_code = 3
            LEFT JOIN reservation_notification AS cancelled ON reservation.reservation_id = cancelled.reservation_id AND cancelled.status_code = 4
            WHERE reservation.reservation_id = ?
        `;
        const values = [reservation_id];
        const rows = await conn.query(query, values);

        const util_query = `SELECT r.reservation_id, ru.utility_id, ru.reserved_quantity, ru.running_total
        FROM reservation r 
        JOIN reservation_utility ru 
        ON r.reservation_id = ru.reservation_id
        WHERE r.reservation_id = ?`;

        const util_rows = await conn.query(util_query, values);
        await conn.commit();
        if (rows[0]) {
            // Format the dates
            ['pending_date', 'booked_date', 'paid_date', 'disapproved_date', 'cancelled_date'].forEach(dateField => {
                if (rows[0][dateField]) {
                    rows[0][dateField] = new Date(rows[0][dateField]).toISOString();
                }
            });
            res.send({reservations: rows[0], utilities: util_rows});
        } else {
            res.status(404).send({errmsg: "Reservation not found", success: false});
        }
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to get all reservations by reservation ID",success: false });
        
    } finally {
        if (conn) conn.release();
    }
}

const getAllReservationsbyRoom = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        const { room_id } = req.body;
        const query = "SELECT * FROM reservation WHERE room_id = ?";
        const values = [room_id];
        const rows = await conn.query(query, values);
        await conn.commit();
        res.send(rows);
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to get all reservations by Room ID",success: false });
        
    } finally {
        if (conn) conn.release();
    }
}

const getAllReservationsbyRoomAndStatus = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        const { room_id, status_code, start_date, end_date } = req.body;

        console.log('Input parameters:', room_id, status_code, start_date, end_date);

        let query = `SELECT * FROM reservation WHERE 1=1`;
        let values = [];

        if (room_id !== -1) {
            query += " AND room_id = ?";
            values.push(room_id);
        }

        if (status_code !== undefined) {
            query += " AND status_code = ?";
            values.push(status_code);
        }

        if (start_date !== undefined && end_date !== undefined) {
            query += ` AND (
                (start_datetime >= ? AND start_datetime < DATE_ADD(?, INTERVAL 1 DAY)) OR 
                (end_datetime > ? AND end_datetime <= DATE_ADD(?, INTERVAL 1 DAY)) OR 
                (start_datetime <= ? AND end_datetime >= DATE_ADD(?, INTERVAL 1 DAY))
            )`;
            values.push(start_date, end_date, start_date, end_date, start_date, end_date);
        }

        const rows = await conn.query(query, values);
        console.log(rows)
        await conn.commit();
        res.send(rows);
    } catch (err) {
        if (conn) await conn.rollback();
        res.send({ errmsg: `Failed to get all reservations by Room ID and status code: ${err}`, success: false });
    } finally {
        if (conn) conn.release();
    }
};
const getRevenuebyRoomAndStatus = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        const { room_id, status_code, start_date, end_date } = req.body;
        let query = `
            SELECT room_id, SUM(total_amount_due) AS revenue
            FROM reservation
            WHERE 1=1
        `;
        let values = [];

        if (room_id !== undefined) {
            query += " AND room_id = ?";
            values.push(room_id);
        }

        if (status_code !== undefined) {
            query += " AND status_code = ?";
            values.push(status_code);
        }

        if (start_date !== undefined && end_date !== undefined) {
            query += ` AND (
                (start_datetime >= ? AND start_datetime < DATE_ADD(?, INTERVAL 1 DAY)) OR 
                (end_datetime > ? AND end_datetime <= DATE_ADD(?, INTERVAL 1 DAY)) OR 
                (start_datetime <= ? AND end_datetime >= DATE_ADD(?, INTERVAL 1 DAY))
            )`;
            values.push(start_date, end_date, start_date, end_date, start_date, end_date);
        }
         
        query += " GROUP BY room_id";

        const rows = await conn.query(query, values);
        await conn.commit();
        res.send(rows);
    } catch (err) {
        if (conn) await conn.rollback();
        res.send({ errmsg: "Failed to get all reservations by Room ID and status code", success: false });
    } finally {
        if (conn) conn.release();
    }
}

// get reservation information of a specific reservation using user_id and activity_name
// inputs: "user_id", "activity_name"
const getReservationByName =  async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        const { user_id, event_name } = req.body;
        const query = "SELECT * FROM reservation WHERE user_id = ? AND activity_name = ?";
        const values = [user_id, event_name];
        const rows = await conn.query(query, values);

        
        const util_query = `SELECT r.reservation_id, ru.utility_id, ru.reserved_quantity, ru.running_total
        FROM reservation r 
        JOIN reservation_utility ru 
        ON r.reservation_id = ru.reservation_id
        WHERE r.user_id = ? AND r.activity_name = ?`;

        const util_rows = await conn.query(util_query, values);
        await conn.commit();

        res.send({reservations: rows, utilities: util_rows});
    } catch (err){
        await conn.rollback();
        res.send({errmsg: "Failed to get all reservations by User ID and Activity Name", success: false });
        
    } finally {
        if (conn) conn.release();
    }
}

// get reservation with dummy data:
const getAllReservationsWithDummyData = async (req, res)  => {
    const dummyData = [
        {
            reservation_id: 1,
            activity_name: 'Activity 1',
            room_id: 1,
            user_id: 'user1@up.edu.ph',
            date_created: new Date(),
            start_datetime: new Date(),
            end_datetime: new Date(),
            discount: 10.00,
            additional_fee: 50.00,
            total_amount_due: 5060.00,
            status_code: 0,
            comments: [
                {
                    comment_id: 1,
                    user_id: 'user1@up.edu.ph',
                    comment_text: 'This is a comment for Activity 1.',
                    date_created: new Date()
                }
            ],
            verified_date: new Date(),
            payment_date: new Date(),
            verification_date: new Date(),
            disapproved_date: new Date(),
            approved_date: new Date()
        },
        {
            reservation_id: 2,
            activity_name: 'Activity 2',
            room_id: 2,
            user_id: 'user2@up.edu.ph',
            date_created: new Date(),
            start_datetime: new Date(),
            end_datetime: new Date(),
            discount: 0.00,
            additional_fee: 0.00,
            total_amount_due: 5000.00,
            status_code: 0,
            comments: [
                {
                    comment_id: 2,
                    user_id: 'user2@up.edu.ph',
                    comment_text: 'This is a comment for Activity 2.',
                    date_created: new Date()
                }
            ],
            verified_date: new Date(),
            payment_date: new Date(),
            verification_date: new Date(),
            disapproved_date: new Date(),
            approved_date: new Date()
        },
        // Add more dummy reservations as needed
    ];

    res.send(dummyData);
}

// get reservations of user using user_id and status_code
// inputs: "user_id" and "status_code"
const getReservationByStatus = async (req, res)  => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        const { user_id, status_code } = req.body;
        const query = "SELECT * FROM reservation WHERE user_id = ? AND status_code = ?";
        const values = [user_id, status_code];
        const rows = await conn.query(query, values);

        const util_query = `SELECT r.reservation_id, ru.utility_id, ru.reserved_quantity, ru.running_total
        FROM reservation r 
        JOIN reservation_utility ru 
        ON r.reservation_id = ru.reservation_id
        WHERE r.user_id = ? AND r.status_code = ?`;

        const util_rows = await conn.query(util_query, values);
        await conn.commit();

        res.send({reservations: rows, utilities: util_rows});
    } catch (err){
        await conn.rollback();
        res.send({errmsg: "Failed to get all reservations by user_id and status", success: false });
        
    } finally {
        if (conn) conn.release();
    }
}

//get all reservations sorted by oldest first
const getReservationSortedOldest = async (req, res)  => {
    let conn;
    try {
        conn = await pool.getConnection()
        await conn.beginTransaction();
        const { user_id } = req.body
        const query = "SELECT * FROM reservation WHERE user_id = ? ORDER BY date_created ASC"
        const values = [user_id]
        const rows = await conn.query(query, values)

        const util_query = `SELECT r.reservation_id, ru.utility_id, ru.reserved_quantity, ru.running_total
        FROM reservation r 
        JOIN reservation_utility ru 
        ON r.reservation_id = ru.reservation_id
        WHERE r.user_id = ? 
        ORDER BY r.date_created ASC`;

        const util_rows = await conn.query(util_query, values);
        await conn.commit();

        res.send({reservations: rows, utilities: util_rows});
    } catch (err){
        await conn.rollback();
        res.send({errmsg: "Failed to get all reservations", success: false });
        
    } finally {
        if (conn) conn.release();
    }
}
//get all reservations sorted by lastest
const getReservationSortedNewest = async (req, res)  => {
    let conn;
    try {
        conn = await pool.getConnection()
        await conn.beginTransaction();
        const { user_id } = req.body;
        const query = "SELECT * FROM reservation WHERE user_id = ? ORDER BY date_created DESC"
        const values = [user_id]
        const rows = await conn.query(query, values)

        const util_query = `SELECT r.reservation_id, ru.utility_id, ru.reserved_quantity, ru.running_total
        FROM reservation r 
        JOIN reservation_utility ru 
        ON r.reservation_id = ru.reservation_id
        WHERE r.user_id = ? 
        ORDER BY r.date_created DESC`;

        const util_rows = await conn.query(util_query, values);
        await conn.commit();

        res.send({reservations: rows, utilities: util_rows});
    } catch (err){
        await conn.rollback();
        console.log(err)
        res.send({errmsg: "Failed to get all reservations", success: false });
        
    } finally {
        if (conn) conn.release();
    }
}

// insert reservation
// notification
const addReservation = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        const { activity_name, activity_desc, room_id, user_id, date_created, start_datetime, end_datetime, discount, additional_fee, total_amount_due, status_code, utilities } = req.body
        
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
        ) VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
        const values = [activity_name, activity_desc, room_id, user_id, date_created, start_datetime, end_datetime, discount, additional_fee, total_amount_due, status_code];
        
        // Execute query
        const result = await conn.query(query, values);

        const res_id = typeof(result.insertId) === "bigint" ? result.insertId.toString() : result.insertId;

        //insert utilities if there is any
        if (utilities && utilities.length !== 0) {
            for (const utility of utilities) {
                const { utility_id, reserved_quantity, running_total } = utility;
                const utilityInsertQuery = `INSERT INTO reservation_utility(reservation_id, utility_id, reserved_quantity, running_total) VALUES(?,?,?,?)`;
                const utilityInsertValues = [result.insertId, utility_id, reserved_quantity, running_total];
                await conn.query(utilityInsertQuery, utilityInsertValues);
            }
        }

        console.log(res_id, typeof(res_id))

        // Insert into reservation_notification table and get the reservation_id from previous query
        const notifQuery = `INSERT INTO reservation_notification(reservation_id, actor_id, status_code, date_created) VALUES(?,?,?,?)`;
        const notifValues = [result.insertId, user_id, status_code, date_created];
        await conn.query(notifQuery, notifValues);

        await addReservationNotification(res_id, conn)

        await conn.commit();
        res.send({ message: "Successfully added reservation.", reservation_id: res_id });
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.send({errmsg: "Failed to add reservation", success: false });
    } finally {
        if (conn) conn.release();
    }
}

//allow edit of reservation as an admin
const editReservation = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        const { reservation_id, activity_name, room_id, start_datetime, end_datetime, discount, additional_fee, total_amount_due } = req.body
        
        var query = `UPDATE reservation SET
            activity_name = ?, 
            room_id = ?, 
            start_datetime = ?,
            end_datetime = ?,
            discount = ?,
            additional_fee = ?,
            total_amount_due =?
            WHERE reservation_id = ?`;
        const values = [activity_name, room_id, start_datetime, end_datetime, discount, additional_fee, total_amount_due, reservation_id];
        
        await conn.query(query, values);
        await conn.commit();
        res.send({ success: true, message: "Successfully edited reservation." });
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to edited reservation", success: false });
    } finally {
        if (conn) conn.release();
    }
}

// adds comment to reservation
// inputs: "reservation_id", "user_id", "comment_text"
// notification
const addComment = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        // user_id is the id of the admin that commented. the actual user id should be retrieved from reservation
        const { reservation_id, user_id, comment_text, status_code } = req.body

        const date_created = new Date()
        const formattedDate = getLocalTime()

        var query = `INSERT INTO comment(reservation_id, user_id, comment_text, date_created) VALUES(?,?,?,?)`
        const values = [reservation_id, user_id, comment_text, formattedDate]
        await conn.query(query, values);

        // Insert into reservation_notification table
        var notifQuery = `INSERT INTO reservation_notification(reservation_id, actor_id, status_code, date_created) VALUES(?,?,?,?)`
        const notifValues = [reservation_id, user_id, status_code, formattedDate]
        await conn.query(notifQuery, notifValues);

        await addReservationCommentNotification(user_id, reservation_id, conn)

        await conn.commit();
        res.send({ message: "Successfully added comment." });
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to add comment", success: false });
        
    } finally {
        if (conn) conn.release();
    }
}

// set the reservation status to approved, status_code = 1
// input: "reservation_id"
// notification
const setAsApproved = async (req, res) => {
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
        const notifQuery = `INSERT INTO reservation_notification(reservation_id, actor_id, status_code, date_created) VALUES(?,?,1,?)`;
        const notifValues = [reservation_id, user_id, formattedDate];

        await addReservationStatusChangeNotification(user_id, reservation_id, conn);


        await conn.query(notifQuery, notifValues);
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

// set the reservation status to paid, status_code = 2
// input: "reservation_id"
// notification
const setAsPaid = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
         // user_id is the id of the admin who changed the status of the reservation
        const { reservation_id, user_id} = req.body
        const query = "UPDATE reservation SET status_code = 2 WHERE reservation_id = ?";
        const values = [reservation_id];
        await conn.query(query, values);

        const date_created = new Date()
        const formattedDate = getLocalTime()

        const insertNotificationQuery = "INSERT INTO reservation_notification(reservation_id, actor_id, status_code, date_created) VALUES (?, ?, 2, ?)";
        const insertValues = [reservation_id, user_id, formattedDate];
        await conn.query(insertNotificationQuery, insertValues);

        await addReservationStatusChangeNotification(user_id, reservation_id, conn);


        await conn.commit();
        res.send({ message: "Successfully edited status to paid." });
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to set reservation as paid", success: false });
        
    } finally {
        if (conn) conn.release();
    }
}

// set the reservation status to disapproved/rejected, status_code = 3
// input: "reservation_id"
// notification
const setAsDisapproved = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
         // user_id is the id of the admin who changed the status of the reservation
        const { reservation_id, user_id } = req.body
        const query = "UPDATE reservation SET status_code = 3 WHERE reservation_id = ?";
        const values = [reservation_id];
        await conn.query(query, values);

        const date_created = new Date()
        const formattedDate = getLocalTime()

        const insertNotificationQuery = "INSERT INTO reservation_notification(reservation_id, actor_id, status_code, date_created) VALUES (?, ?, 3, ?)";
        const insertValues = [reservation_id, user_id, formattedDate];
        await conn.query(insertNotificationQuery, insertValues);

        await addReservationStatusChangeNotification(user_id, reservation_id, conn);


        await conn.commit();
        res.send({ message: "Successfully edited status to disapproved." });
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to set reservation as disapproved", success: false });
        
    } finally {
        if (conn) conn.release();
    }
}

// set the reservation status to cancelled, status_code = 4
// input: "reservation_id"
// notification
const setAsCancelled = async (req, res) => {
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

        await addReservationStatusChangeNotification(user_id, reservation_id, conn);
        
        await conn.commit();
        res.send({ message: "Successfully edited status to cancelled." });
    } catch (err) {
        console.log(err);
        await conn.rollback();
        res.send({errmsg: "Failed to set reservation as cancelled", success: false });
        
    } finally {
        if (conn) conn.release();
    }
}



// get reservations of a room per time range
// inputs: "room_id", "start_datetime", "end_datetime"
//                                                 y  m  d
// example inputs: "15", "2024-01-01 00:00:00", "2024-01-31 23:59:59"
const getReservationByRoom = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        const { room_id,start_datetime, end_datetime } = req.body
        
        // var query = `INSERT INTO room(room_name, room_capacity, fee, room_type) VALUES(?,?,?,?)`;
        var query = `SELECT *
                    FROM reservation
                    WHERE room_id = ?
                    AND start_datetime >= ?
                    AND end_datetime <= ?;`;
        const values = [room_id, start_datetime, end_datetime];
        
        var rows = await conn.query(query, values);

        const util_query = `SELECT r.reservation_id, ru.utility_id, ru.reserved_quantity, ru.running_total
        FROM reservation r 
        JOIN reservation_utility ru 
        ON r.reservation_id = ru.reservation_id
        WHERE room_id = ?
        AND start_datetime >= ?
        AND end_datetime <= ?`;

        const util_rows = await conn.query(util_query, values);
        await conn.commit();

        res.send({reservations: rows, utilities: util_rows});
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to get resevations by room", success: false });
        
    } finally {
        if (conn) conn.release();
    }
}


const getTotalRequest = async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.beginTransaction();
            
            var query = `SELECT COUNT(*) AS count FROM reservation WHERE status_code IN (0, 1)`;
            
            var result = await conn.query(query);
            await conn.commit();
            // Extract count from result and send as JSON
            res.json({ count: Number(result[0].count) });
        } catch (err) {
            await conn.rollback();
            res.send({errmsg: "Failed to get total number of requests", success: false });
            
        } finally {
            if (conn) conn.release();
        }
    }
    
    const getPendingRequest = async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.beginTransaction();
            
            var query = `SELECT COUNT(*) AS count FROM reservation WHERE status_code = 0`;
            
            var result = await conn.query(query);
            
            await conn.commit();
            // Extract count from result and send as JSON
            res.json({ count: Number(result[0].count) });
        } catch (err) {
            await conn.rollback();
            res.send({errmsg: "Failed to get total number of pending requests",success: false });
            
        } finally {
            if (conn) conn.release();
        }
    }
    
    const getTotalAccounts = async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.beginTransaction();
            
            var query = `SELECT COUNT(*) AS count FROM user`;
            
            var result = await conn.query(query);
            
            await conn.commit();
            // Extract count from result and send as JSON
            res.json({ count: Number(result[0].count) });
        } catch (err) {
            await conn.rollback();
            res.send({errmsg: "Failed to get total number of accounts", success: false });
            
        } finally {
            if (conn) conn.release();
        }
    }
    
    const getNewAccounts = async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.beginTransaction();
            
            var query = `SELECT COUNT(*) AS count FROM user WHERE isFirstTimeLogin = TRUE`;
            
            var result = await conn.query(query);
            
            await conn.commit();
            // Extract count from result and send as JSON
            res.json({ count: Number(result[0].count) });
        } catch (err) {
            await conn.rollback();
            res.send({errmsg: "Failed to get total number of new accounts", success: false });
            
        } finally {
            if (conn) conn.release();
        }
    }
    
    const getPaid = async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.beginTransaction();
            
            var query = `SELECT SUM((total_amount_due + additional_fee) * (1 - discount)) AS count
            FROM reservation WHERE status_code = 2`;
            
            var result = await conn.query(query);
            
            await conn.commit();
            // Extract count from result and send as JSON
            res.json({ count: Number(result[0].count) });
        } catch (err) {
            await conn.rollback();
            res.send({errmsg: "Failed to get sum of payments", success: false });
            
        } finally {
            if (conn) conn.release();
        }
    }
    
    const getPending = async (req, res) => {
        let conn;
        try {
            conn = await pool.getConnection();
            await conn.beginTransaction();
            
            var query = `SELECT SUM((total_amount_due + additional_fee) * (1 - discount)) AS count
            FROM reservation
            WHERE status_code = 1`;
            
            var result = await conn.query(query);
            await conn.commit();
    
            // Extract count from result and send as JSON
            res.json({ count: Number(result[0].count) });
        } catch (err) {
            await conn.rollback();
            res.send({errmsg: "Failed to get sum of pending payments", success: false });
            
        } finally {
            if (conn) conn.release();
        }
    }


const getTotalRoomReservations = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        const { email } = req.body
        const query = "SELECT COUNT(*) as totalReservations FROM reservation WHERE user_id = ?";
        const values = [email];
        const rows = await conn.query(query, values);
        //convert to number
        rows[0].totalReservations = Number(rows[0].totalReservations);
        await conn.commit();
        res.send(rows[0]);
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to get sum of all room reservations", success: false });
        
    } finally {
        if (conn) conn.release();
    }
}


const getAllReservations = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        const query = "SELECT reservation.*, room.room_name FROM reservation JOIN room ON reservation.room_id = room.room_id; ";
        const rows = await conn.query(query);
        await conn.commit();
        res.send(rows);
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to get all reservations", success: false });
        
    } finally {
        if (conn) conn.end();
    }
}
    
const getAvailableRoomTime = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        const { room_id, date } = req.body;
        const selectedDate = new Date(date);

        const reservationQuery = `SELECT start_datetime, end_datetime FROM reservation WHERE room_id = ? AND DATE(start_datetime) = ?`;
        const classQuery = `SELECT time_start, time_end FROM class INNER JOIN class_day ON class.class_id = class_day.class_id WHERE room_id = ? AND ? BETWEEN DATE(start_date) AND DATE(end_date) AND class_day = ?`;

        const reservationValues = [room_id, selectedDate.toISOString().split('T')[0]]; // Extract the date part of the selected date
        const classDay = selectedDate.getUTCDay() === 0 ? 7 : selectedDate.getUTCDay(); // Adjusted to match the database's day of the week representation
        const classValues = [room_id, selectedDate, classDay];

        const reservationTimes = await conn.query(reservationQuery, reservationValues);
        const classTimes = await conn.query(classQuery, classValues);

        const occupiedTimes = [];

        // Add reservation times to occupiedTimes
        reservationTimes.forEach(reservationTime => {
            let startHour = new Date(reservationTime.start_datetime).getHours();
            let endHour = new Date(reservationTime.end_datetime).getHours();
            for (let i = startHour; i < endHour; i++) {
                occupiedTimes.push(i);
            }
        });

        // Add class times to occupiedTimes
        classTimes.forEach(classTime => {
            let startHour = parseInt(classTime.time_start.split(':')[0]);
            let endHour = parseInt(classTime.time_end.split(':')[0]);
            for (let i = startHour; i < endHour; i++) {
                occupiedTimes.push(i);
            }
        });

        // Generate all possible hourly times for the selected date
        const allTimes = Array.from({length: 24}, (_, i) => i);

        // Subtract occupiedTimes from allTimes to get availableTimes
        const availableTimes = allTimes.filter(time => !occupiedTimes.includes(time));

        // Format availableTimes to include the time in 'hh:mm:ss' format
        const availableTimesFormatted = availableTimes.map(time => {
            let hours = time.toString().padStart(2, '0');
            return `${hours}:00:00`;
        });
        await conn.commit();

        res.send({ availableTimes: availableTimesFormatted });
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to get available room times", success: false });
        
    } finally {
        if (conn) conn.release();
    }
}

const getAdminCommentByID = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        const { reservation_id } = req.body
        const query = "SELECT * from comment WHERE reservation_id = ?";
        const values = [reservation_id];
        const rows = await conn.query(query, values);
        await conn.commit();
        res.send(rows);
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to get admin comment by reservation ID", success: false });
        
    } finally {
        if (conn) conn.release();
    }
}

// getUpdateDate is not possible to track unless new table

const getReservationIdByEventName = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection()
        await conn.beginTransaction();
        const { activity_name } = req.body
        const query = "SELECT reservation_id from reservation WHERE activity_name = ?"
        const name = `%${activity_name}%`
        const values = [name]
        const rows = await conn.query(query, values)
        await conn.commit()
        res.send(rows);
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to get reservation id by activity name", success: false });
        
    } finally {
        if (conn) conn.release();
    }
}

const getReservationTimeline = async(req,res) => {
    let conn;
    try{
        conn = await pool.getConnection()
        await conn.beginTransaction();
        const { reservation_id } = req.body

        const rows = await conn.query("SELECT * FROM reservation_notification WHERE reservation_id = ? ORDER BY date DESC", [reservation_id]);
        await conn.commit();
        if(rows.length === 0){
            res.send({success:false, msg: "Reservation not found"})
        }else{
            res.send({success:true, data: rows})
        }
        
    }catch{
        await conn.rollback();
        res.send({success:false, msg: "Failed to get Resevation"})
    }finally {
        if (conn) conn.release()
    }
}

// returns the sum of the total fee per reservation made in a room given the category
// input: "room_id", "category"
const getRevenueReport = async(req, res) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const { room_id, category } = req.body;

        let groupBy;
        switch (category) {
            case 'yearly':
                groupBy = 'YEAR(date_created)';
                break;
            case 'monthly':
                groupBy = 'CONCAT(YEAR(date_created), "/", MONTH(date_created))';
                break;
            case 'weekly':
                groupBy = 'CONCAT(YEAR(date_created), "/", WEEK(date_created))';
                break;
            case 'daily':
                groupBy = 'DATE(date_created)';
                break;
            default:
                throw new Error('Invalid category');
        }

        const query = `SELECT ${groupBy} AS period, SUM(total_amount_due) AS revenue 
                       FROM reservation 
                       WHERE room_id = ? AND status_code = 2 
                       GROUP BY ${groupBy}`;
        const values = [room_id];
        const rows = await conn.query(query, values);
        res.send(rows);
        
    } catch (err) {
        res.send({success: false, msg: "Failed to get Reservation", error: err.message});
    } finally {
        if (conn) conn.release();
    }
}

export { 
    getReservationIdByEventName, getAdminCommentByID, getRevenuebyRoomAndStatus,
    getTotalRequest, getPendingRequest, getTotalAccounts, getNewAccounts, 
    getPending, getPaid, getAllReservationsByUser, getReservation, getReservationByName, 
    getReservationByStatus, getReservationByRoom, addReservation, setAsApproved, setAsCancelled, 
    setAsDisapproved, setAsPaid, addComment, getAllReservations, getTotalRoomReservations,
    getReservationSortedOldest, getReservationSortedNewest, getAllReservationsbyRoom, getAvailableRoomTime,
    getAllReservationsWithDummyData, getReservationTimeline, editReservation, getRevenueReport, getAllReservationsbyRoomAndStatus
}


