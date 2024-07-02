import pool from './db.js';
import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'
import fs from 'fs'
import { getEmailFlair } from './utils/google-storage.js';
import { getLocalTime } from './utils/getlocaltime.js';

let configMailerOptions = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_EMAIL, // Your Gmail address
        pass: process.env.SMTP_APP_PASSWORD // Your App Password
    }
}

// notifications is handled by two tables:
// 1. notification
// 2. reservation_notification
//
// a notification is generated whenever:
// 1. a reservation's status is updated: create a notifcation with the user key being 
//      a foreign key in the reservation entry - handled by reservation_notification?
// 2. comments in reservation - handled by notifications?
// 3. the status of a user is updated - handled by notifications?

// notif table
// notification_id          INT AUTO_INCREMENT PRIMARY KEY,
// notification_type        INT
// notification_action      VARCHAR(50) NOT NULL,
// notification_body        VARCHAR(255) NOT NULL,
// actor_id                 VARCHAR(50) NOT NULL,
// user_id                  VARCHAR(50) NOT NULL 

// reservation notification
// notif_id                 INT AUTO_INCREMENT PRIMARY KEY,
// reservation_id           INT,
// actor_id                 VARCHAR(50) NOT NULL,   
// status_code              INT,
// date_created             DATETIME DEFAULT NOW(),
// CONSTRAINT               notif_reservation_id_fk FOREIGN KEY(reservation_id) REFERENCES reservation(reservation_id),
// CONSTRAINT               notif_actor_id_fk FOREIGN KEY(actor_id) REFERENCES user(email)

/*        Notification mappings         *\
  0 - reservation status change
  1 - user type change
  2 - admin comment added to reservation
\*                                      */

// generic addNotification function - unused
const addNotification = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();

        const { action, body, actor, user } = req.body;
        // use notifications with an s
        const query = "insert into notifications(notification_action,notification_body,actor_id,user_id) values(?,?,?,?)";
        const values = [action, body, actor, user];
        
        await conn.query(query, values);

        await conn.commit();
        res.send({message: "Successfully added reservation." });


    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to get all reservations by Room ID",success: false });
        
    } finally {
        if (conn) conn.release();
    }
}

const addReservationNotification = async (reservation_id, conn) => {

    const q0 = "SELECT user_id FROM reservation WHERE reservation_id = ?";
    const qval0 = [reservation_id];
    const qres0 = await conn.query(q0,qval0);
    const user_id = qres0[0]["user_id"];

    // get user name
    const q2 = "SELECT fname, lname, usertype FROM user WHERE email = ?";
    const qval2 = [user_id];
    const qres2 = await conn.query(q2,qval2);
    var user_status = ""
    //console.log(qres2);
    const user_name = qres2[0]["fname"] + " " + qres2[0]["lname"];

    // get reservation
    const q3 = "SELECT * from reservation where reservation_id = ?";
    const qval3 = [reservation_id]
    const qres3 = await conn.query(q3,qval3);
    var act_name = qres3[0]["activity_name"]
    let total_amount_due = qres3[0]["total_amount_due"]
    let start_datetime = qres3[0]["start_datetime"]
    let end_datetime = qres3[0]["end_datetime"]
    let date = qres3[0]["date_created"]

    // console.log(qres3)

    // console.log(act_name, total_amount_due, start_datetime, end_datetime, date)

    var status_code = ""
    let banner_img = ""

    switch(qres3[0]["status_code"]) {
        case 0:
            status_code = "Pending"
            banner_img = "thanks.png"
            break;
        case 1:
            status_code = "Payment Pending"
            banner_img = "pending.png"
            break;
        case 2:
            status_code = "Approved"
            banner_img = "approved.png"
            break;
        case 3:
            status_code = "Rejected"
            banner_img = "disapproved.png"
            break;
        case 4:
            status_code = "Cancelled"
            banner_img = "cancelled.png"
            break;
    }

    const q4 = "SELECT * from reservation_utility WHERE reservation_id = ?"
    const qres4 = await conn.query(q4,qval3);

    let utilitiesAvailed = []
    let utilitiesString = "" 
    // console.log(qres4)
    for (const utility of qres4) {
        utilitiesAvailed.push(Number(utility.utility_id))
        
    }
    // console.log(utilitiesAvailed)

    for (const [index, id] of utilitiesAvailed.entries()) {
        // console.log(index, id)
        const qres5 = await conn.query("SELECT item_name, item_qty FROM utility WHERE utility_id = ?",[id])
        // console.log(qres5)
        if (index != utilitiesAvailed.length-1){
            utilitiesString = utilitiesString + `${qres5[0]["item_name"]} (${qres5[0]["item_qty"]}), `
        }else{
            utilitiesString = utilitiesString + `${qres5[0]["item_name"]} (${qres5[0]["item_qty"]})`
        }
        
    }
    // console.log(utilitiesString)

    if (utilitiesString == ""){
        utilitiesString = "None"
    }

    var action = "Reservation Added"
    var body = `Added ${fixName(user_name)} reservation for activity ${act_name} (${status_code})`

    //console.log(body);
    const date_created = new Date()
    const formattedDate = getLocalTime()
    console.log(date_created, formattedDate)

    const query = "insert into notifications(notification_type, notification_action,notification_body,notification_date,actor_id,user_id) values(0,?,?,?,?,?)";
    const values = [action, body, formattedDate, user_id, user_id];
    await conn.query(query, values);

    //add nodemailer here to mail the appropriate guest
    const mailOptions = {
    from: process.env.SMTP_EMAIL, // Sender address (your Gmail address)
    to: user_id, // Recipient address
    subject: `ICSpaces Room Reservation: ${act_name}'s reservation has been added`, // Email subject
    // Email content (HTML)
    html: `
    <img src="cid:banner_image" style="width:700px; height:auto;"/>

    <p>Dear <strong>${user_name}</strong>,</p>

    <p>Your reservation for activity <strong>${act_name}</strong> has been added.</p>

    <h3>Reservation Details:</h3>
    <ul>
        <li>Activity: <strong>${act_name}</strong></li>
        <li>Status: <strong>${status_code}</strong></li>
        <li>Date created: <strong>${date_created}</strong></li>
        <li>Total amount due: <strong>${total_amount_due}</strong></li>
        <li>Start Date Time: <strong>${start_datetime}</strong></li>
        <li>End Date Time: <strong>${end_datetime}</strong></li>
        <li>Utilities Availed: <strong>${utilitiesString}</strong></li>
    </ul>
    <p>If you have any questions or need further assistance, please do not hesitate to contact us.</p>

    <p>Best regards,<br/>
    <strong>ICSpaces Team</strong></p>
    <a href="https://icspaces.online">Visit ICSpaces Website</a>
    `, 
    attachments: [{
        filename: banner_img,
        path: `./assets/${banner_img}`,
        cid: 'banner_image' //same cid value as in the html img src
    }]
};
    // Send the email
    let transporter = nodemailer.createTransport(configMailerOptions);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
    // await conn.commit();

}

// there are some functions in reservation-controller that has insert into statements for reservation_notification
const addReservationStatusChangeNotification = async (admin_id, reservation_id, conn) => {

    const q0 = "SELECT user_id FROM reservation WHERE reservation_id = ?";
    const qval0 = [reservation_id];
    const qres0 = await conn.query(q0,qval0);
    const user_id = qres0[0]["user_id"];

    const q1 = "SELECT fname, lname FROM user WHERE email = ?";
    const qval1 = [admin_id];
    const qres1 = await conn.query(q1,qval1);
    //console.log(qres1);
    const admin_name = qres1[0]["fname"] + " " + qres1[0]["lname"];

    // get user name
    const q2 = "SELECT fname, lname, usertype FROM user WHERE email = ?";
    const qval2 = [user_id];
    const qres2 = await conn.query(q2,qval2);
    var user_status = ""
    //console.log(qres2);
    const user_name = qres2[0]["fname"] + " " + qres2[0]["lname"];

    // get reservation
    const q3 = "SELECT reservation_id, activity_name, status_code from reservation where reservation_id = ?";
    const qval3 = [reservation_id]
    const qres3 = await conn.query(q3,qval3);
    var act_name = qres3[0]["activity_name"]

    var status_code = ""
    let banner_img = ""

    switch(qres3[0]["status_code"]) {
        case 0:
            status_code = "Pending"
            banner_img = "thanks.png"
            break;
        case 1:
            status_code = "Payment Pending"
            banner_img = "pending.png"
            break;
        case 2:
            status_code = "Approved"
            banner_img = "approved.png"
            break;
        case 3:
            status_code = "Rejected"
            banner_img = "disapproved.png"
            break;
        case 4:
            status_code = "Cancelled"
            banner_img = "cancelled.png"
            break;
    }

    var action = "Reservation Status Change"
    if (status_code == "Cancelled") {
        var body = `${fixName(user_name)}'s reservation for activity ${act_name} has changed its status into ${status_code}`
    } else {
        var body = `Admin ${admin_name} has changed the status of ${fixName(user_name)} reservation for activity ${act_name} into ${status_code}`
    }
    
    

    //console.log(body);
    const date_created = new Date()
    const formattedDate = getLocalTime()

    const query = "insert into notifications(notification_type, notification_action,notification_body,notification_date,actor_id,user_id) values(0,?,?,?,?,?)";
    const values = [action, body, formattedDate, admin_id, user_id];
    await conn.query(query, values);

    //add nodemailer here to mail the appropriate guest
    const mailOptions = {
    from: process.env.SMTP_EMAIL, // Sender address (your Gmail address)
    to: user_id, // Recipient address
    subject: `ICSpaces Room Reservation: ${act_name}'s status is changed to ${status_code}`, // Email subject
    // Email content (HTML)
    html: `
    <img src="cid:banner_image" style="width:700px; height:auto;"/>

    <p>Dear <strong>${user_name}</strong>,</p>

    <p>Admin <strong>${admin_name}</strong> has changed the status of your reservation for activity <strong>${act_name}</strong> to <strong>${status_code}</strong>.</p>

    <h3>Reservation Details:</h3>
    <ul>
        <li>Activity: <strong>${act_name}</strong></li>
        <li>Status: <strong>${status_code}</strong></li>
    </ul>

    <p>If you have any questions or need further assistance, please do not hesitate to contact us.</p>

    <p>Best regards,<br/>
    <strong>ICSpaces Team</strong></p>
    <a href="https://icspaces.online">Visit ICSpaces Website</a>
    `, 
    attachments: [{
        filename: banner_img,
        path: `./assets/${banner_img}`,
        cid: 'banner_image' //same cid value as in the html img src
    }]
};
    // Send the email
    let transporter = nodemailer.createTransport(configMailerOptions);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
    // await conn.commit();

}

// called in user-controller
const addUserStatusChangeNotification = async (admin_id, user_id, conn) => {   

        // get admin name
        const q1 = "SELECT fname, lname FROM user WHERE email = ?";
        const qval1 = [admin_id];
        const qres1 = await conn.query(q1,qval1);
        //console.log(qres1);
        const admin_name = qres1[0]["fname"] + " " + qres1[0]["lname"];

        // get user name
        const q2 = "SELECT fname, lname, usertype FROM user WHERE email = ?";
        const qval2 = [user_id];
        const qres2 = await conn.query(q2,qval2);
        var user_status = ""
        // console.log(qres2);
        const user_name = qres2[0]["fname"] + " " + qres2[0]["lname"];

        switch(qres2[0]["usertype"]) {
            case 0:
                user_status = "Student"
                break;
            case 1:
                user_status = "Faculty"
                break;
            case 2:
                user_status = "OIC"
                break;
            case 3:
                user_status = "Director"
                break;
    };

    const action = "User Status Change";
    const body = `Admin ${admin_name} has set user ${fixName(user_name)} status into ${user_status}`;

    const date_created = new Date()
    const formattedDate = getLocalTime()


    const query = "insert into notifications(notification_type, notification_action,notification_body,notification_date,actor_id,user_id) values(1,?,?,?,?,?)";
    const values = [action, body, formattedDate, admin_id, user_id];
    
    await conn.query(query, values);

    const mailOptions = {
    from: process.env.SMTP_EMAIL, // Sender address (your Gmail address)
    to: user_id, // Recipient address
    subject: `ICSpaces User Status Update: ${fixName(user_name)} is now ${user_status}`, // Email subject
    html: `
    <p>Dear <strong>${user_name}</strong>,</p>

    <p>Admin <strong>${admin_name}</strong> has updated your user status to <strong>${user_status}</strong>.</p>

    <p>If this change was unexpected or if you have any questions, please do not hesitate to contact us.</p>

    <p>Best regards,<br/>
    <strong>ICSpaces Team</strong></p>
    <a href="https://icspaces.online">Visit ICSpaces Website</a>
    <img src="cid:banner_image" style="width:700px; height:auto;"/>
    `, // Email content (HTML)
    attachments: [{
        filename: `banner.png`,
        path: `./assets/banner.png`,
        cid: 'banner_image' //same cid value as in the html img src
    }]
};
    // Send the email
    let transporter = nodemailer.createTransport(configMailerOptions);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

}

const addReservationCommentNotification = async (admin_id, reservation_id, conn) => {
    const q0 = "SELECT reservation_id, activity_name, status_code, user_id FROM reservation WHERE reservation_id = ?";
    const qval0 = [reservation_id];
    const qres0 = await conn.query(q0,qval0);
    const user_id = qres0[0]["user_id"];

    const q1 = "SELECT fname, lname FROM user WHERE email = ?";
    const qval1 = [admin_id];
    const qres1 = await conn.query(q1,qval1);
    //console.log(qres1);
    const admin_name = qres1[0]["fname"] + " " + qres1[0]["lname"];

    // get user name
    const q2 = "SELECT fname, lname, usertype FROM user WHERE email = ?";
    const qval2 = [user_id];
    const qres2 = await conn.query(q2,qval2);
    var user_status = ""
    //console.log(qres2);
    const user_name = qres2[0]["fname"] + " " + qres2[0]["lname"];

    var act_name = qres0[0]["activity_name"]

    var action = "Admin Reservation Comment"
    var body = `Admin ${admin_name} has added a comment in reservation for activity ${act_name}`

    const date_created = new Date()
    const formattedDate = getLocalTime()

    //console.log(body);

    const query = "insert into notifications(notification_type, notification_action,notification_body, notification_date, actor_id,user_id) values(2,?,?,?,?,?)";
    const values = [action, body, formattedDate, admin_id, user_id];

    await conn.query(query, values);

    const mailOptions = {
    from: process.env.SMTP_EMAIL, // Sender address (your Gmail address)
    to: user_id, // Recipient address
    subject: `ICSpaces Room Reservation: ${admin_name} Commented on Your Reservation for ${act_name}`, // Email subject
    html: `
    <p>Dear <strong>${user_name}</strong>,</p>

    <p>Admin <strong>${admin_name}</strong> has added a comment to your reservation for activity <strong>${act_name}</strong>.</p>

    <p>Comment: <strong>${body}</strong></p>

    <p>If you have any questions or need further assistance, please do not hesitate to contact us.</p>

    <p>Best regards,<br/>
    <strong>ICSpaces Team</strong></p>
    <a href="https://icspaces.online">Visit ICSpaces Website</a>
    <img src="cid:banner_image" style="width:700px; height:auto;"/>
    `, // Email content (HTML)
    attachments: [{
        filename: `banner.png`,
        path: `./assets/banner.png`,
        cid: 'banner_image' //same cid value as in the html img src
    }]
};
    // Send the email
    let transporter = nodemailer.createTransport(configMailerOptions);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

}

const addDeleteRoomNotification = async (admin_id, room_name, mode, conn) => {

    const q1 = "SELECT fname, lname FROM user WHERE email = ?";
    const qval1 = [admin_id];
    const qres1 = await conn.query(q1,qval1);
    const admin_name = qres1[0]["fname"] + " " + qres1[0]["lname"];

    if (mode == "add") {
        var action = "Add Room"
        var body = `Admin ${admin_name} has added room ${room_name}`
    } else if (mode == "delete") {
        var action = "Delete Room"
        var body = `Admin ${admin_name} has removed room ${room_name}`
    }

    

    const date_created = new Date()
    const formattedDate = getLocalTime()

    const query = "insert into notifications(notification_type, notification_action, notification_body, notification_date, actor_id, user_id) values(3,?,?,?,?,?)";
    const values = [action, body, formattedDate, admin_id, admin_id];

    await conn.query(query, values);
}


const addDeleteUtilityNotification = async (admin_id, utility_name, room_id, mode, conn) => {

    const q0 = "SELECT room_name FROM room WHERE room_id = ?";
    const qval0 = [room_id];
    const qres0 = await conn.query(q0, qval0);
    const room_name = qres0[0]["room_name"];

    const q1 = "SELECT fname, lname FROM user WHERE email = ?";
    const qval1 = [admin_id];
    const qres1 = await conn.query(q1,qval1);
    const admin_name = qres1[0]["fname"] + " " + qres1[0]["lname"];

    if (mode == "add") {
        var action = "Add Utility"
        var body = `Admin ${admin_name} has added utility ${utility_name} for room ${room_name}`
    } else if (mode == "delete") {
        var action = "Delete Utility"
        var body = `Admin ${admin_name} has removed utility ${utility_name} from room ${room_name}`
    } else if (mode == "update") {
        var action = "Update Utility"
        var body = `Admin ${admin_name} has updated utility ${utility_name} from room ${room_name}`;
    }

    

    const date_created = new Date()
    const formattedDate = getLocalTime()

    const query = "insert into notifications(notification_type, notification_action, notification_body, notification_date, actor_id, user_id) values(3,?,?,?,?,?)";
    const values = [action, body, formattedDate, admin_id, admin_id];

    await conn.query(query, values);
}

const getNotificationsForUser = async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const { user_id } = req.body; 
      const notifications = await conn.query("SELECT notification_type, notification_action, notification_body, notification_date, actor_id, user_id FROM notifications WHERE user_id = ? ORDER BY notification_date desc", [user_id]);
      res.send(notifications);
    } catch (err) {
      console.error('Error:', err);
      res.status(500).send({errmsg: "Failed to get notifications", success: false });
    } finally {
      if (conn) conn.release();
    }
  }

// helper functions
function fixName(name) {
    // Check if the last character is 's' or 'z'
    const lastChar = name.charAt(name.length - 1).toLowerCase();
    if (lastChar === 's' || lastChar === 'z') {
        return `${name}'`;
    } else {
        return `${name}'s`;
    }
}

const addGuestReservationNotification = async (admin_id, transaction_id, conn) => {
    //get admin
    const q1 = "SELECT fname, lname FROM user WHERE email = ?";
    const qval1 = [admin_id];
    const qres1 = await conn.query(q1,qval1);
    //console.log(qres1);
    const admin_name = qres1[0]["fname"] + " " + qres1[0]["lname"];

    // get user name
    const q2 = "SELECT fname, lname, email, reservation_id FROM guest WHERE transaction_id = ? ";
    const qval2 = [transaction_id];
    const qres2 = await conn.query(q2,qval2);
    // console.log(qres2);
    const reservation_id = qres2[0]["reservation_id"]
    const reciepient_email = qres2[0]["email"]
    const user_name = qres2[0]["fname"] + " " + qres2[0]["lname"];

    // get reservation
    const q3 = "SELECT * from reservation WHERE reservation_id = ?";
    const qval3 = [reservation_id]
    const qres3 = await conn.query(q3,qval3);
    let act_name = qres3[0]["activity_name"]
    const { date_created, start_datetime, end_datetime, total_amount_due } = qres3[0]

    const q4 = "SELECT * from reservation_utility WHERE reservation_id = ?"
    const qres4 = await conn.query(q4,qval3);

    let utilitiesAvailed = []
    let utilitiesString = "" 
    // console.log(qres4)
    for (const utility of qres4) {
        utilitiesAvailed.push(Number(utility.utility_id))
        
    }
    // console.log(utilitiesAvailed)

    for (const [index, id] of utilitiesAvailed.entries()) {
        // console.log(index, id)
        const qres5 = await conn.query("SELECT item_name, item_qty FROM utility WHERE utility_id = ?",[id])
        // console.log(qres5)
        if (index != utilitiesAvailed.length-1){
            utilitiesString = utilitiesString + `${qres5[0]["item_name"]} (${qres5[0]["item_qty"]}), `
        }else{
            utilitiesString = utilitiesString + `${qres5[0]["item_name"]} (${qres5[0]["item_qty"]})`
        }
        
    }
    // console.log(utilitiesString)

    if (utilitiesString == ""){
        utilitiesString = "None"
    }

    let status_code = ""
    let banner_img = ""

    switch(qres3[0]["status_code"]) {
        case 0:
            status_code = "Pending"
            banner_img = "thanks.png"
            break;
        case 1:
            status_code = "Payment Pending"
            banner_img = "pending.png"
            break;
        case 2:
            status_code = "Approved"
            banner_img = "approved.png"
            break;
        case 3:
            status_code = "Rejected"
            banner_img = "disapproved.png"
            break;
        case 4:
            status_code = "Cancelled"
            banner_img = "cancelled.png"
            break;
    }

    var action = "Reservation Status Change"
    var body = `Admin ${admin_name} has changed the status of ${fixName(user_name)} reservation for activity ${act_name} into ${status_code}`

    const newdate = new Date()
    const formattedDate = newdate.toISOString().slice(0, 19).replace('T', ' ');

    //console.log(body);

    const query = "insert into notifications(notification_type, notification_action,notification_body,notification_date,actor_id,user_id) values(0,?,?,?,?,?)";
    const values = [action, body, formattedDate, admin_id, reciepient_email];
    await conn.query(query, values);

    //add nodemailer here to mail the appropriate guest
    const mailOptions = {
    from: process.env.SMTP_EMAIL, // Sender address (your Gmail address)
    to: reciepient_email, // Recipient address
    subject: `ICSpaces Room Reservation: ${act_name}'s reservation has been added to the system.`, // Email subject
    html: `
    <img src="cid:banner_image" style="width:700px; height:auto;"/>

    <p>Dear <strong>${user_name}</strong>,</p>
    
    <p>Admin <strong>${admin_name}</strong> has added your reservation for activity <strong>${act_name}</strong> </p>

    <h3>Reservation Details:</h3>
    <ul>
        <li>Transaction ID: <strong>${transaction_id}</strong></li>
        <li>Activity: <strong>${act_name}</strong></li>
        <li>Status: <strong>${status_code}</strong></li>
        <li>Date created: <strong>${date_created}</strong></li>
        <li>Total amount due: <strong>${total_amount_due}</strong></li>
        <li>Start Date Time: <strong>${start_datetime}</strong></li>
        <li>End Date Time: <strong>${end_datetime}</strong></li>
        <li>Utilities Availed: <strong>${utilitiesString}</strong></li>
    </ul>

    <p>If you have any questions or need further assistance, please do not hesitate to contact us.</p>

    <p>Best regards,<br/>
    <strong>ICSpaces Team</strong></p>
    <a href="https://icspaces.online">Visit ICSpaces Website</a>
    `, // Email content (HTML)
    attachments: [{
        filename: banner_img,
        path: `./assets/${banner_img}`,
        cid: 'banner_image' //same cid value as in the html img src
    }]
};
    // Send the email
    let transporter = nodemailer.createTransport(configMailerOptions);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
    // await conn.commit();

}

const addGuestReservationStatusChangeNotification = async (admin_id, transaction_id, conn) => {
    //get admin
    const q1 = "SELECT fname, lname FROM user WHERE email = ?";
    const qval1 = [admin_id];
    const qres1 = await conn.query(q1,qval1);
    //console.log(qres1);
    const admin_name = qres1[0]["fname"] + " " + qres1[0]["lname"];

    // get user name
    const q2 = "SELECT fname, lname, email, reservation_id FROM guest WHERE transaction_id = ? ";
    const qval2 = [transaction_id];
    const qres2 = await conn.query(q2,qval2);
    console.log(qres2);
    const reservation_id = qres2[0]["reservation_id"]
    const reciepient_email = qres2[0]["email"]
    const user_name = qres2[0]["fname"] + " " + qres2[0]["lname"];

    // get reservation
    const q3 = "SELECT reservation_id, activity_name, status_code from reservation where reservation_id = ?";
    const qval3 = [reservation_id]
    const qres3 = await conn.query(q3,qval3);
    let act_name = qres3[0]["activity_name"]

    let status_code = ""
    let banner_img = ""

    switch(qres3[0]["status_code"]) {
        case 0:
            status_code = "Pending"
            banner_img = "thanks.png"
            break;
        case 1:
            status_code = "Payment Pending"
            banner_img = "pending.png"
            break;
        case 2:
            status_code = "Approved"
            banner_img = "approved.png"
            break;
        case 3:
            status_code = "Rejected"
            banner_img = "disapproved.png"
            break;
        case 4:
            status_code = "Cancelled"
            banner_img = "cancelled.png"
            break;
    }

    var action = "Reservation Status Change"
    var body = `Admin ${admin_name} has changed the status of ${fixName(user_name)} reservation for activity ${act_name} into ${status_code}`

    //console.log(body);

    const newdate = new Date()
    const formattedDate = newdate.toISOString().slice(0, 19).replace('T', ' ');
    

    const query = "insert into notifications(notification_type, notification_action,notification_body,notification_date,actor_id,user_id) values(0,?,?,?,?,?)";
    const values = [action, body, formattedDate, admin_id, reciepient_email];
    await conn.query(query, values);

    //add nodemailer here to mail the appropriate guest
    const mailOptions = {
    from: process.env.SMTP_EMAIL, // Sender address (your Gmail address)
    to: reciepient_email, // Recipient address
    subject: `ICSpaces Room Reservation: ${act_name}'s status is changed to ${status_code}`, // Email subject
    html: `
    <img src="cid:banner_image" style="width:700px; height:auto;"/>

    <p>Dear <strong>${user_name}</strong>,</p>

    <p>Admin <strong>${admin_name}</strong> has changed the status of your reservation for activity <strong>${act_name}</strong> to <strong>${status_code}</strong>.</p>

    <h3>Reservation Details:</h3>
    <ul>
        <li>Transaction ID: <strong>${transaction_id}</strong></li>
        <li>Activity: <strong>${act_name}</strong></li>
        <li>Status: <strong>${status_code}</strong></li>
    </ul>

    <p>If you have any questions or need further assistance, please do not hesitate to contact us.</p>

    <p>Best regards,<br/>
    <strong>ICSpaces Team</strong></p>
    <a href="https://icspaces.online">Visit ICSpaces Website</a>
    `, // Email content (HTML)
    attachments: [{
        filename: banner_img,
        path: `./assets/${banner_img}`,
        cid: 'banner_image' //same cid value as in the html img src
    }]
};
    // Send the email
    let transporter = nodemailer.createTransport(configMailerOptions);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
    // await conn.commit();

}

const getSystemLogs = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const { notification_type } = req.body; 
        let query = "SELECT * FROM notifications";
        let values = [];

        if (notification_type !== undefined) {
            query += " WHERE notification_type = ?";
            values.push(notification_type);
        }

        query += " ORDER BY notification_date DESC";

        const rows = await conn.query(query, values);
        res.send(rows);
    } catch (err) {
        res.send({ errmsg: `Failed to get system logs: ${err}`, success: false });
    } finally {
        if (conn) conn.release();
    }
}

export { addReservationNotification,addDeleteRoomNotification, addDeleteUtilityNotification, getSystemLogs, addReservationStatusChangeNotification, addUserStatusChangeNotification, addReservationCommentNotification, getNotificationsForUser, addGuestReservationNotification, addGuestReservationStatusChangeNotification }