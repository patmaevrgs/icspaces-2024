USE icspaces;

CREATE TABLE faculty_member(
    email VARCHAR(50) PRIMARY KEY,
    college VARCHAR(50),
    department VARCHAR(50),
    CONSTRAINT faculty_member_email_fk FOREIGN KEY(email) REFERENCES user(email)
);

--dummy
INSERT INTO faculty_member(email, college, department) VALUES('ddoffemaria@up.edu.ph' , 'College of Arts and Sciences', 'Institute of Computer Science');
INSERT INTO faculty_member(email, college, department) VALUES('dabutardo@up.edu.ph' , 'College of Arts and Sciences', 'Institute of Computer Science');
INSERT INTO faculty_member(email, college, department) VALUES('hyang@up.edu.ph', 'College of Human Ecology', 'Department of Human and Family Development Studies');