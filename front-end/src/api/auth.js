const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Login user with email, password, and optional device metadata
 * @param {Object} credentials - { mail, password, deviceInfo }
 */
export async function loginUser({ mail, password, deviceInfo }) {
	const endpoint = `${BASE_URL}/api/auth/login`;
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ mail, password, deviceInfo })
	});
	const data = await response.json().catch(() => null);
	return { ok: response.ok, status: response.status, data };
}

/**
 * Register a new user account
 * @param {Object} userData - { name, mail, password, deviceInfo }
 */
export async function registerUser({ name, mail, password, deviceInfo }) {
	const endpoint = `${BASE_URL}/api/auth/register`;
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ name, mail, password, deviceInfo })
	});
	const data = await response.json().catch(() => null);
	return { ok: response.ok, status: response.status, data };
}
