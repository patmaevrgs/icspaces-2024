USE icspaces;

CREATE TABLE ics_rc_oic(
    email VARCHAR(50) PRIMARY KEY,
    CONSTRAINT ics_rc_oic_email_fk FOREIGN KEY(email) REFERENCES user(email)
);

--dummy
INSERT INTO ics_rc_oic(email) VALUES('jjkuya@up.edu.ph');
INSERT INTO ics_rc_oic(email) VALUES('lmaquino2@up.edu.ph');
INSERT INTO ics_rc_oic(email) VALUES('svtanig@up.edu.ph');
INSERT INTO ics_rc_oic(email) VALUES('cdleyco@up.edu.ph');
INSERT INTO ics_rc_oic(email) VALUES('jabaltazar3@up.edu.ph');
INSERT INTO ics_rc_oic(email) VALUES('geestillero@up.edu.ph');