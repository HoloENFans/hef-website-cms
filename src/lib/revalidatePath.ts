export default async (path: string) => {
	await fetch(`${process.env.PAYLOAD_PUBLIC_WEBSITE_URL}/api/revalidate`, {
		method: 'POST',
		headers: {
			Authorization: process.env.REVALIDATE_SECRET,
		},
		body: JSON.stringify({
			path,
		}),
	});
};
