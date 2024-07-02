import express from "express"
import cors from "cors"
import dotenv from 'dotenv'
dotenv.config()
import session from 'express-session'
import { SMTPServer } from 'smtp-server';

import MySQLStoreInit from 'express-mysql-session';
const MySQLStore = MySQLStoreInit(session);

import setUpRoutes from "./routes.js";
//connect MariaDB
import pool from './db.js';

//session store
const options = {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_ROOT_PASSWORD,
	database: process.env.MYSQL_DATABASE,
	createDatabaseTable: true,
};

const sessionStore = new MySQLStore(options);

// initialize express app
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Allow CORS
app.use(cors({
    origin: [`${process.env.FRONTEND_URL}:3000`], //allowed URLs
    methods: ['GET', 'POST', 'OPTIONS'], //allowed HTTP methods
    credentials: true, //allow cookies
    // allowedHeaders: ['Access-Control-Allow-Origin','Access-Control-Allow-Methods','Origin','Accept','Content-Type','X-Requested-With','Cookie']
}));

//express-session 
app.use(
    session({
        secret: process.env.PRIVATE_KEY,
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
		cookie: {
			secure: false,
			httpOnly: true,
			maxAge: Number(process.env.ACCESS_TOKEN_TTL)
		}
    })
)

//SMTP Server
// const smtpserver = new SMTPServer({
//     // SMTP server options
//     secure: false,
//     disabledCommands: ['STARTTLS'], // Disable STARTTLS for simplicity
//     logger: true,
//     onData(stream, session, callback) {
//         // process and save incoming email
//         let emailData = '';

//         // Read email content from the stream
//         stream.on('data', (chunk) => {
//             emailData += chunk.toString();
//         });

//         // When the email data has been fully received
//         stream.on('end', async () => {
//             const parsedEmail = await simpleParser(emailData);

//             // Log the parsed email
//             console.log('Received email:');
//             console.log('From:', parsedEmail.from.text);
//             console.log('To:', parsedEmail.to.text);
//             console.log('Subject:', parsedEmail.subject);
//             console.log('Text Body:', parsedEmail.text);
//             console.log('HTML Body:', parsedEmail.html);

//             // Callback to indicate that processing is complete
//             callback();
//         });
//     }
// });

// smtpserver.listen(process.env.SMTP_PORT, process.env.BACKEND_URL, () => {
//     console.log('SMTP server listening on port 25');
// });

// Setup routes
setUpRoutes(app);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});