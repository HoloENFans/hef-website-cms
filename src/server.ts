import 'dotenv/config';
import express from 'express';
import payload from 'payload';
import nodemailerSendgrid from 'nodemailer-sendgrid';

const app = express();

// Redirect root to Admin panel
app.get('/', (_, res) => {
	res.redirect('/admin');
});

// Initialize Payload
payload.init({
	secret: process.env.PAYLOAD_SECRET,
	mongoURL: process.env.MONGODB_URI,
	express: app,
	onInit: () => {
		payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
	},
	email: {
		fromName: 'Hololive EN Fan Website - CMS',
		fromAddress: 'cms@holoen.fans',
		...(process.env.SENDGRID_KEY ? {
			transport: nodemailerSendgrid({
				apiKey: process.env.SENDGRID_KEY,
			}),
		} : {
			logMockCredentials: true,
		}),
	},
});

// Add your own express routes here

app.listen(3001);
