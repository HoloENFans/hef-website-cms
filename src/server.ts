import 'dotenv/config';
import express from 'express';
import payload from 'payload';
import path from 'path';

const app = express();

// Order matters!
app.get('/robots.txt', (_, res) => {
	res.type('text/plain');
	res.send('User-agent: *\nDisallow: /');
});

app.use((_, res, next) => {
	res.header('X-Robots-Tag', 'noindex');
	next();
});

app.get('/', (_, res) => {
	res.redirect('/admin');
});

app.use('/assets', express.static(path.resolve(__dirname, '../assets')));

// Initialize Payload
const start = async () => {
	await payload.init({
		secret: process.env.PAYLOAD_SECRET,
		express: app,
		onInit: () => {
			payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
		},
		email: {
			fromName: 'Hololive EN Fan Website - CMS',
			fromAddress: 'cms@holoen.fans',
			...(process.env.SMTP_HOST ? {
				transportOptions: {
					service: 'SendGrid',
					auth: {
						user: process.env.SMTP_USERNAME,
						pass: process.env.SMTP_PASSWORD,
					},
				},
			} : {
				logMockCredentials: true,
			}),
		},
	});

	app.use('/forms', (await import('./routers/forms')).default);

	app.listen(3001);
};

// eslint-disable-next-line no-void
void start();
