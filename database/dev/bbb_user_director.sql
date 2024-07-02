USE icspaces;

CREATE TABLE director(
    email VARCHAR(50) PRIMARY KEY,
    CONSTRAINT director_email_fk FOREIGN KEY(email) REFERENCES user(email)
    );

--dummy
INSERT INTO director(email) VALUES('maandoc@up.edu.ph');