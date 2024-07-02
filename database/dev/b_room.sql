USE icspaces;

CREATE TABLE room(
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    room_name VARCHAR(50),
    room_capacity INT,
    fee DECIMAL(10,2),
    room_type VARCHAR(50),
    floor_number INT, -- 0 for ground and so on
    isDeleted BOOLEAN DEFAULT FALSE,
    additional_fee_per_hour DECIMAL(10,2) DEFAULT 0    
);

CREATE TABLE utility(
    utility_id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT,
    item_name VARCHAR(50), -- example: chair, PC, fan, aircon
    item_qty INT,
    fee DECIMAL(10,2),
    isDeleted BOOLEAN DEFAULT FALSE,
    CONSTRAINT room_utility_fk FOREIGN KEY(room_id) REFERENCES room(room_id) ON DELETE CASCADE
);

CREATE TABLE room_file(
    room_file_id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT,
    file_path VARCHAR(255) NOT NULL,
    date_created DATETIME DEFAULT NOW(),
    UNIQUE(file_path), -- to prevent duplicate files
    CONSTRAINT room_file_room_id_fk FOREIGN KEY(room_id) REFERENCES room(room_id) ON DELETE CASCADE
);

--dummy
INSERT INTO room(room_name, room_capacity, fee, room_type, floor_number) VALUES('ICS Lecture Hall', 100, 5000.00, 'Lecture Hall', 0);
INSERT INTO room(room_name, room_capacity, fee, room_type, floor_number) VALUES('ICS Conference Room', 50, 3000.00, 'Conference Room', 0);
INSERT INTO room(room_name, room_capacity, fee, room_type, floor_number) VALUES('ICS Computer Lab', 30, 2000.00, 'Computer Lab', 0);
INSERT INTO utility(room_id, item_name, item_qty, fee) VALUES(3, 'PC', 30, 100.00); 