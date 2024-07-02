USE icspaces;

CREATE TABLE guest(
    transaction_id VARCHAR(50) PRIMARY KEY,
    reservation_id INT,
    fname VARCHAR(50),
    lname VARCHAR(50),
    email VARCHAR(50) NOT NULL
);

--dummy
INSERT INTO guest(transaction_id, fname, lname, email) VALUES('e5hkadfhjk', 'Juan', 'Dela Cruz', 'abc@yahoo.com');
INSERT INTO guest(transaction_id, fname, lname, email) VALUES('efdsa68713', 'Maria', 'Clara', 'dcg@yahoo.com');
