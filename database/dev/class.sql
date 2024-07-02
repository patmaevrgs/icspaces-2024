USE icspaces;

CREATE TABLE class(
    class_id INT PRIMARY KEY NOT NULL,
    class_name VARCHAR(50),
    class_type VARCHAR(50),
    lecturer VARCHAR(50),
    class_section VARCHAR(10),
    start_date DATE,
    end_date DATE,
    time_start TIME,
    time_end TIME,
    room_id INT,
    CONSTRAINT classes_room_id_fk FOREIGN KEY(room_id) REFERENCES room(room_id)
);

--  days_in_a_week INT, -- considered as a multi-valued attribute, so another table
CREATE TABLE class_day(
    class_id INT NOT NULL,
    class_day INT NOT NULL,
    PRIMARY KEY(class_id, class_day),
    CONSTRAINT class_id_fk FOREIGN KEY(class_id) REFERENCES class(class_id)
);

--dummy
INSERT INTO class(class_id, class_name, class_type, lecturer, class_section, start_date, end_date, time_start, time_end, room_id) VALUES(1, 'ICS 123', 'Lecture', 'Dr. Juan dela Cruz', 'A', '2020-12-01', '2020-12-31', '08:00:00', '10:00:00', 1);
INSERT INTO class(class_id, class_name, class_type, lecturer, class_section, start_date, end_date, time_start, time_end, room_id) VALUES(2, 'ICS 124', 'Lecture', 'Dr. Maria Clara', 'B', '2020-12-01', '2020-12-31', '08:00:00', '10:00:00', 2);
INSERT INTO class_day(class_id, class_day) VALUES(1, 1);
INSERT INTO class_day(class_id, class_day) VALUES(1, 3);
INSERT INTO class_day(class_id, class_day) VALUES(2, 4);
INSERT INTO class_day(class_id, class_day) VALUES(2, 2);