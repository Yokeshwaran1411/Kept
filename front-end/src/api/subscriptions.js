const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Fetch subscriptions for a user by email
 * @param {string} email - User email address
 */
export async function getSubscriptions(email) {
	const endpoint = `${BASE_URL}/api/subscriptions?mail=${encodeURIComponent(email)}`;
	const response = await fetch(endpoint, {
		method: 'GET',
		headers: {
			'Accept': 'application/json'
		}
	});
	const data = await response.json().catch(() => null);
	return { ok: response.ok, status: response.status, data };
}
