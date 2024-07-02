import pool from './db.js';
import {addDeleteRoomNotification, addDeleteUtilityNotification} from "./notifications-controller.js";



// Form: http://localhost:3001/search?type={TYPE}&room_id={ROOM_ID}
const searchHandler = async (req, res) => {
    const { type } = req.body;
    try {
        switch(type) {
            case 'id':
                return await searchRoomById(req, res);
            case 'name':
                return await searchRoomByName(req, res);
            case 'type':
                return await searchRoomByType(req, res);
            case 'capacity':
                return await searchRoomByCapacity(req, res);
            case 'capacity_range':
                return await searchRoomByCapacityRange(req, res);    
            case 'floor':
                return await searchRoomByFloor(req, res);
            default:
                return await getAllRoomsAndUtilities(req, res);
        }
    } catch (err) {
        console.error("Error in searchHandler:", err);
    } 
}

const searchRoomById = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await pool.beginTransaction();
        const { type, room_id } = req.body;

        const query = "SELECT * FROM room WHERE room_id = ?";
        let values = [room_id]
        const rows = await conn.query(query, values);

        await conn.commit();
        res.send(rows);
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to search room by id", success: false });
    } finally {
        if (conn) conn.release();
    }
}

const searchRoomByName = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await pool.beginTransaction();
        const { type, room_name } = req.body;

        //need to optimize

        const query = "SELECT * FROM room WHERE room_name LIKE ? AND isDeleted = FALSE";
        const searchvalue = `%${room_name}%`
 
        let values = [searchvalue]
        const rows = await conn.query(query, values);
        console.log(rows);

        await conn.commit();
        res.send(rows);
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to search room by room name", success: false });
    } finally {
        if (conn) conn.release();
    }
}

const searchRoomByType = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await pool.beginTransaction();
        const { type, room_type } = req.body;

        const query = "SELECT * FROM room WHERE room_type LIKE ? AND isDeleted = FALSE";
        const searchvalue = `%${room_type}%`

        const values = [searchvalue]
        const rows = await conn.query(query, values);

        await conn.commit();
        res.send(rows);
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to search room by room type", success: false });
    } finally {
        if (conn) conn.release();
    }
}

const searchRoomByCapacity = async (req, res) =>{
    let conn;
    try {
        conn = await pool.getConnection();
        await pool.beginTransaction();
        const { type, room_capacity } = req.body;

        const query = `SELECT * FROM room WHERE room_capacity <= ? AND isDeleted = FALSE`;
        var values = [room_capacity]
        const rows = await conn.query(query, values);

        await conn.commit();
        res.send(rows);
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to search room by room capacity", success: false });
    } finally {
        if (conn) conn.release();
    }
}


const searchRoomByCapacityRange = async (req, res) =>{
    let conn;
    try {
        conn = await pool.getConnection();
        await pool.beginTransaction();
        const { type, upper_capacity, lower_capacity } = req.body;

        const query = `SELECT * FROM room WHERE room_capacity >= lower_capacity AND room_capacity <= upper_capacity  AND isDeleted = FALSE`;
        var values = [upper_capacity, lower_capacity]
        const rows = await conn.query(query, values);

        await conn.commit();
        res.send(rows);
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to search room by capacity range", success: false });
    } finally {
        if (conn) conn.release();
    }
}

const searchRoomByFloor = async (req, res) =>{
    let conn;
    try {
        conn = await pool.getConnection();
        await pool.beginTransaction();
        const { type, floor_number } = req.body;

        const query = `SELECT * FROM room WHERE floor_number = ? AND isDeleted = FALSE`;
        var values = [floor_number]
        const rows = await conn.query(query, values);

        await conn.commit();
        res.send(rows);
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to search room by floor", success: false });
    } finally {
        if (conn) conn.release();
    }
}

const getRoomInfo = async (req,res) => {
    let conn;
    try {
        conn = await pool.getConnection()
        // await pool.beginTransaction();

        const room_id= parseInt(req.body.room_id)
        var roomquery = `SELECT * FROM room WHERE room_id = ?`
        var roomvalues = [room_id]
        var roomrows = await conn.query(roomquery, roomvalues)
        var utilquery = `SELECT * FROM utility WHERE room_id = ?`
        var utilvalues = [room_id]
        var utilrows = await conn.query(utilquery, utilvalues)

        let result = {
            'room' : roomrows[0], 
            'utility': utilrows
        }

        // await conn.commit();
        res.send(result)
    } catch (err) {
        // await conn.rollback();
        res.send({errmsg: "Failed to get room info by room ID", success: false });
    } finally {
        if (conn) conn.release();
    }
}


const getAllRoomsAndUtilities = async (req, res) => {

    let conn;
    try {
        conn = await pool.getConnection();
        // await pool.beginTransaction();
        const rooms = await conn.query("SELECT * FROM room WHERE isDeleted = FALSE");
        const utilities = await conn.query("SELECT * FROM utility");

        // Map utilities to their respective rooms
        const roomsWithUtilities = rooms.map(room => {
            room.utilities = utilities.filter(utility => utility.room_id === room.room_id).map(utility => utility.item_name);
            return room;
        });

        // await conn.commit();
        res.send(roomsWithUtilities);
    } catch (err) {
        // await conn.rollback();
        console.log(err)
        res.send({errmsg: "Failed to get rooms and utilities", success: false });
    } finally {
        if (conn) conn.release();
    }
}

const getAllRoomsAndUtilitiesComplete = async (req, res) => {

    let conn;
    try {
        conn = await pool.getConnection();
        // await pool.beginTransaction();
        const rooms = await conn.query("SELECT * FROM room WHERE isDeleted = FALSE");
        const utilities = await conn.query("SELECT * FROM utility");

        // Map utilities to their respective rooms
        const roomsWithUtilities = rooms.map(room => {
            room.utilities = utilities.filter(utility => utility.room_id === room.room_id).map(utility => utility);
            return room;
        });

        // await conn.commit();
        res.send(roomsWithUtilities);
    } catch (err) {
        // await conn.rollback();
        console.log(err)
        res.send({errmsg: "Failed to get rooms and utilities", success: false });
    } finally {
        if (conn) conn.release();
    }
}

const getAllRooms = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await pool.beginTransaction();
        const query = `SELECT * FROM room WHERE isDeleted = FALSE`;
        const rows = await conn.query(query);

        await conn.commit();
        res.send(rows);
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to get all rooms", success: false });
    } finally {
        if (conn) conn.release();
    }
}


const insertRoom = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await pool.beginTransaction();
        const { room_id, room_name, room_capacity, fee, room_type, admin_id } = req.body
        
        var query = `INSERT INTO room(room_name, room_capacity, fee, room_type) VALUES(?,?,?,?)`;
        const values = [room_name, room_capacity, fee, room_type];
        
        var result = await conn.query(query, values);

        await addDeleteRoomNotification(admin_id, room_name, "add", conn);

        await conn.commit();
        res.send(result);
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to insert room", success: false });
    } finally {
        if (conn) conn.release();
    }
}

const setRoomClassSchedule = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await pool.beginTransaction();
        const { class_id, class_name, class_type, lecturer, class_section, start_date, end_date, time_start, time_end, room_id, class_days } = req.body;

        let query = `INSERT INTO class(class_id, class_name, class_type, lecturer, class_section, start_date, end_date, time_start, time_end, room_id) VALUES(?,?,?,?,?,?,?,?,?,?)`;
        let values = [class_id, class_name, class_type, lecturer, class_section, start_date, end_date, time_start, time_end, room_id];
        await conn.query(query, values);

        for (let day of class_days) {
            query = `INSERT INTO class_day(class_id, class_day) VALUES(?,?)`;
            values = [class_id, day];
            await conn.query(query, values);
        }

        await conn.commit();
        res.send({ message: "Class schedule added successfully." });
    } catch (err) {
        await conn.rollback();
        console.error("Error in setRoomClassSchedule:", err);
        res.status(500).send({ message: "Error adding class schedule.", error: err.message });
    } finally {
        if (conn) conn.release();
    }
}

// set the edited information of a room
// input: "status_code", "room_name", "room_capacity", "fee", "room_type", "additional_fee_per_hour", "room_id"
const setEditedRoom = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        const { room_name, room_capacity, fee, room_type, floor_number, additional_fee_per_hour, room_id } = req.body
        const query =  `UPDATE room SET 
        room_name = ?,
        room_capacity = ?,
        fee = ?,
        room_type = ?,
        floor_number = ?,
        additional_fee_per_hour = ?
        WHERE room_id = ?`;
        const values = [ room_name, room_capacity, fee, room_type, floor_number, additional_fee_per_hour, room_id];
        await conn.query(query, values);
        await conn.commit();
        res.send({ message: "Successfully edited room details." });
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to set edited information of a room", success: false });
    } finally {
        if (conn) conn.release();
    }
}

// adds utility to a room if it does not exist
// input: "room_id", "item_name", "item_qty"
const addUtility = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await pool.beginTransaction();
        const { room_id, item_name, item_qty, fee, admin_id } = req.body

        // Check if the item already exists in the room
        const checkQuery = `SELECT * FROM utility WHERE room_id = ? AND item_name = ?`;
        const checkValues = [room_id, item_name];
        const rows = await conn.query(checkQuery, checkValues);

        if (rows.length > 0) {
            // send error message if existing
            await conn.commit();
            res.status(400).send({ message: "Item already exists in the room." });
        } else {
            // add item if it does not exist yet
            const insertQuery = `INSERT INTO utility(room_id, item_name, item_qty, fee) VALUES(?,?,?,?)`;
            const insertValues = [room_id, item_name, item_qty, fee];
            await conn.query(insertQuery, insertValues);

            
            await addDeleteUtilityNotification(admin_id, item_name,room_id, "add", conn);
            await conn.commit();
            res.send({ message: "Successfully added utility." });
        }
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to add utility", success: false });
    } finally {
        if (conn) conn.release();
    }
}

// deletes utility from a room
// input: "room_id", "item_name"
const deleteUtility = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        const { room_id, item_name, admin_id } = req.body

        // Check if the utility exists
        const result = await conn.query(`SELECT * FROM utility WHERE room_id = ? AND item_name = ? AND isDeleted = false`, [room_id, item_name]);
        const rows = result[0];
        if (!rows || rows.length === 0) {
            await conn.commit();
            res.status(404).send({ message: "Utility not found or already deleted." });
            return;
        }

        // Mark the utility as deleted
        const query = `UPDATE utility SET isDeleted = true WHERE room_id = ? AND item_name = ?`;
        const values = [ room_id, item_name ];
        
        await conn.query(query, values);

        const q0 = "SELECT room_name FROM room WHERE room_id = ?";
        const qval0 = [room_id];
        const qres0 = await conn.query(q0, qval0);
        const room_name = qres0[0]["room_name"];
        await addDeleteUtilityNotification(admin_id, item_name, room_id, "delete", conn);
        await conn.commit();

        await conn.commit();
        res.send({ message: "Successfully deleted utility." });
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to delete utility", success: false });
    } finally {
        if (conn) conn.release();
    }
}


const getAllRoomFilters = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        const roomTypesResult = await conn.query("SELECT DISTINCT room_type FROM room WHERE isDeleted = FALSE");
        const floorsResult = await conn.query("SELECT DISTINCT floor_number FROM room WHERE isDeleted = FALSE");
        const capacitiesResult = await conn.query("SELECT DISTINCT room_capacity FROM room WHERE isDeleted = FALSE");

        // Extract just the values into arrays
        const roomTypes = roomTypesResult.map(row => row.room_type);
        const floors = floorsResult.map(row => row.floor_number);
        const capacities = capacitiesResult.map(row => row.room_capacity);
        
        await conn.commit();
        res.send({ roomTypes, floors, capacities });
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to get all room filters", success: false });
    } finally {
        if (conn) conn.release();
    }
}

// get the room name
// input: "room_id"
const getRoomName = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        const { room_id } = req.body;

        // Check if the room exists
        const result = 'SELECT room_name FROM room WHERE room_id = ?';
        const rows = await conn.query(result, room_id);

        
        if (!rows || rows.length === 0) {
            await conn.commit();
            res.status(404).send({ message: "Room not found." });
            return;
        }

        // Send the room name
        await conn.commit();
        res.send({ roomName: rows[0].room_name });
    } catch (err) {
        await conn.rollback();
        res.status(500).send({ error: 'Database query error' });
    } finally {
        if (conn) conn.release();
    }
};

const processUtilities = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const { room_name, room_id, utilities, room_capacity, fee, room_type, floor_number, additional_fee_per_hour, admin_id } = req.body

        await conn.beginTransaction();

        // Update room details
        const updateRoomQuery = `UPDATE room SET room_name=?, room_capacity = ?, fee = ?, room_type = ?, floor_number = ?, additional_fee_per_hour = ? WHERE room_id = ?`;
        const updateRoomValues = [room_name, room_capacity, fee, room_type, floor_number, additional_fee_per_hour, room_id];

        await conn.query(updateRoomQuery, updateRoomValues);

        // Get existing utilities from the database
        const existingUtilitiesQuery = `SELECT * FROM utility WHERE room_id = ?`;
        const existingUtilities = await conn.query(existingUtilitiesQuery, [room_id]);

        for (let i = 0; i < utilities.length; i++) {
            const { item_name, item_qty, fee } = utilities[i];

            // Check if the utility exists in the database
            const existingUtility = existingUtilities.find(utility => utility.item_name === item_name);

            if (existingUtility) {
                // Update the utility if it exists
                const updateQuery = `UPDATE utility SET item_qty = ?, fee = ? WHERE room_id = ? AND item_name = ?`;
                const updateValues = [item_qty, fee, room_id, item_name];
                await conn.query(updateQuery, updateValues);
                await addDeleteUtilityNotification(admin_id, item_name, room_id, "update", conn);
            } else {
                // Add the utility if it does not exist
                const insertQuery = `INSERT INTO utility(room_id, item_name, item_qty, fee) VALUES(?,?,?,?)`;
                const insertValues = [room_id, item_name, item_qty, fee];
                await conn.query(insertQuery, insertValues);
                await addDeleteUtilityNotification(admin_id, item_name, room_id, "add", conn);
            }
        }

        // Mark utilities as deleted that exist in the database but not in the request
        for (let i = 0; i < existingUtilities.length; i++) {
            const { item_name } = existingUtilities[i];

            if (!utilities.find(utility => utility.item_name === item_name)) {
                const deleteQuery = `UPDATE utility SET isDeleted = true WHERE room_id = ? AND item_name = ?`;
                const deleteValues = [room_id, item_name];

                await conn.query(deleteQuery, deleteValues);
                await addDeleteUtilityNotification(admin_id, item_name, room_id, "delete", conn);
            }
        }
        
        await conn.commit();
        res.send({ message: "Successfully processed utilities and updated room details." });
    } catch (err) {
        await conn.rollback();
        res.send({errmsg: "Failed to process utilities and update room details", success: false });
    } finally {
        if (conn) conn.release();
    }
}

const addNewRoom = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        const { room_name, room_capacity, fee, room_type, floor_number, additional_fee_per_hour, utilities, admin_id } = req.body

        // Check if the room already exists in the database
        const existingRoomQuery = `SELECT * FROM room WHERE room_name = ?`;
        const existingRoom = await conn.query(existingRoomQuery, [room_name]);
        let returnedRoomId
        if (existingRoom.length > 0) {
            // If the room exists, send an error response
            await conn.commit();
            res.send({errmsg: "Room already exists", success: false });
            return;
        } else {
            // Insert the new room into the room table
            const insertRoomQuery = `INSERT INTO room(room_name, room_capacity, fee, room_type, floor_number, additional_fee_per_hour) VALUES(?,?,?,?,?,?)`;
            const insertRoomValues = [room_name, room_capacity, fee, room_type, floor_number, additional_fee_per_hour];
            
            await addDeleteRoomNotification(admin_id, room_name, "add", conn);
            
            await conn.query(insertRoomQuery, insertRoomValues);

            // Get the ID of the inserted room
            const result = await conn.query('SELECT LAST_INSERT_ID() as room_id');
            const room_id = result[0].room_id;
            returnedRoomId = room_id
            console.log('Room ID:', room_id, returnedRoomId);

            for (let i = 0; i < utilities.length; i++) {
                const { item_name, item_qty, fee } = utilities[i];
            
                // Check if the utility already exists in the room
                const existingUtilityQuery = `SELECT * FROM utility WHERE room_id = ? AND item_name = ?`;
                const existingUtility = await conn.query(existingUtilityQuery, [room_id, item_name]);
            
                if (existingUtility.length > 0) {
                    // If the utility exists, skip to the next utility
                    continue;
                } else {
                    // Add the utility if it does not exist
                    const insertQuery = `INSERT INTO utility(room_id, item_name, item_qty, fee) VALUES(?,?,?,?)`;
                    const insertValues = [room_id, item_name, item_qty, fee];
                    await conn.query(insertQuery, insertValues);
                }
            }
        }

        await conn.commit();
        res.send({ room_id: Number(returnedRoomId) ,message: "Successfully added room and processed utilities."});

    } catch (err) {
        await conn.rollback(); 
        res.send({errmsg: `Failed to add room and process utilities: ${err}`, success: false });
    } finally {
        if (conn) conn.release();
    }
}

const getAllArchivedRoomsAndUtilities = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        // await pool.beginTransaction();
        const rooms = await conn.query("SELECT * FROM room WHERE isDeleted = TRUE");
        const utilities = await conn.query("SELECT * FROM utility");

        // Map utilities to their respective rooms
        const roomsWithUtilities = rooms.map(room => {
            room.utilities = utilities.filter(utility => utility.room_id === room.room_id).map(utility => utility);
            return room;
        });

        // await conn.commit();
        res.send(roomsWithUtilities);
    } catch (err) {
        // await conn.rollback();
        console.log(err)
        res.send({errmsg: "Failed to get rooms and utilities", success: false });
    } finally {
        if (conn) conn.release();
    }
}

const deleteRoom = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();
        const { room_id, admin_id } = req.body

        if (!room_id || !Number.isInteger(parseFloat(room_id))) {
            throw new Error("Invalid room_id");
        }

        const query =  `UPDATE room SET isDeleted = TRUE WHERE room_id = ?`;
        const values = [room_id];
        await conn.query(query, values);

        const q0 = "SELECT room_name FROM room WHERE room_id = ?";
        const qval0 = [room_id];
        const qres0 = await conn.query(q0, qval0);
        const room_name = qres0[0]["room_name"];
        await addDeleteRoomNotification(admin_id, room_name, "delete", conn);
        await conn.commit();

        res.send({ message: "Successfully deleted room." });
    } catch (err) {
        await conn.rollback();
        console.log(err);
        res.send({errmsg: "Failed to set edited information of a room", success: false });
    } finally {
        if (conn) conn.release();
    }
}



export { deleteRoom, searchHandler, searchRoomByCapacity, searchRoomByType, searchRoomByName, getRoomInfo, getAllRoomsAndUtilitiesComplete, getAllRooms , getAllRoomsAndUtilities, searchRoomById, insertRoom, setRoomClassSchedule, setEditedRoom, addUtility, deleteUtility, getRoomName, getAllRoomFilters, processUtilities, addNewRoom, getAllArchivedRoomsAndUtilities }

