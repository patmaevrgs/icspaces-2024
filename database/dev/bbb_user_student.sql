USE icspaces;

CREATE TABLE student(
    email VARCHAR(50) PRIMARY KEY,
    student_number VARCHAR(50),
    org VARCHAR(150),
    course VARCHAR(50), -- full name
    college VARCHAR(50), -- full name
    department VARCHAR(50), -- full name
    CONSTRAINT student_email_fk FOREIGN KEY(email) REFERENCES user(email)
    );

-- Dummy data
INSERT INTO student(email, student_number, org, course, college, department) VALUES('ajsantiago@up.edu.ph', '202316279' , 'The Unix Union','BS Computer Science', 'College of Arts and Sciences', 'Institute of Computer Science');
INSERT INTO student(email, student_number, org, course, college, department) VALUES('arigor@up.edu.ph', '202070895', 'The Unix Union', 'BS Mathematics','College of Arts and Sciences', 'Institute of Computer Science');
INSERT INTO student(email, student_number, org, course, college, department) VALUES('asilva@up.edu.ph', '201931811', 'The Unix Union','BS Chemistry','College of Arts and Sciences', 'Institute of Computer Science');