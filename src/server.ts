import 'dotenv/config';
import express from 'express';
import payload from 'payload';

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
		...(process.env.SMTP_HOST ? {
			transportOptions: {
				host: process.env.SMTP_HOST,
				auth: {
					user: process.env.SMTP_USERNAME,
					pass: process.env.SMTP_PASSWORD,
				},
				port: 587,
				secure: true,
			},
		} : {
			logMockCredentials: true,
		}),
	},
});

// Add your own express routes here

app.listen(3001);
