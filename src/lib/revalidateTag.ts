export default async function revalidateTag(tag: string) {
	await fetch(`${process.env.PAYLOAD_PUBLIC_WEBSITE_URL}/api/revalidatetag`, {
		method: 'POST',
		headers: {
			Authorization: process.env.REVALIDATE_SECRET,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			tag,
		}),
	});
}
