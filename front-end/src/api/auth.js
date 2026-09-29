const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Login user with email and password
 * @param {Object} credentials - { mail, password }
 */
export async function loginUser({ mail, password }) {
	const endpoint = `${BASE_URL}/api/auth/login`;
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ mail, password })
	});
	const data = await response.json().catch(() => null);
	return { ok: response.ok, status: response.status, data };
}

/**
 * Register a new user account
 * @param {Object} userData - { name, mail, password }
 */
export async function registerUser({ name, mail, password }) {
	const endpoint = `${BASE_URL}/api/auth/register`;
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ name, mail, password })
	});
	const data = await response.json().catch(() => null);
	return { ok: response.ok, status: response.status, data };
}
