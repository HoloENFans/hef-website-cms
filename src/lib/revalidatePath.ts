export default async function revalidatePath(path: string) {
	await fetch(`${process.env.PAYLOAD_PUBLIC_WEBSITE_URL}/api/revalidate`, {
		method: 'POST',
		headers: {
			Authorization: process.env.REVALIDATE_SECRET,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			path,
		}),
	});
}
