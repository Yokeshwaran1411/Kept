const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Update user profile details
 * @param {Object} userData - { id, name, mail }
 */
export async function updateUserProfile({ id, name, mail }) {
	const endpoint = `${BASE_URL}/api/users/update`;
	const response = await fetch(endpoint, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ id, name, mail })
	});
	const data = await response.json().catch(() => null);
	return { ok: response.ok, status: response.status, data };
}

export async function getUserData(userId) {
	const endpoint = `${BASE_URL}/api/users/${userId}`;
	const response = await fetch(endpoint, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data = await response.json().catch(() => null);
	return { ok: response.ok, status: response.status, data };
}

/**
 * Fetch login history from backend
 * @param {string} mail - User email address
 */
export async function getUserLoginHistory(mail) {
	const url = mail 
		? `${BASE_URL}/api/users/login-history?mail=${encodeURIComponent(mail)}`
		: `${BASE_URL}/api/users/login-history`;
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data = await response.json().catch(() => null);
	return { ok: response.ok, status: response.status, data };
}

/**
 * Record a login history entry directly
 * @param {string} mail
 * @param {Object} deviceInfo
 */
export async function recordUserLoginHistory(mail, deviceInfo) {
	const endpoint = `${BASE_URL}/api/users/login-history`;
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ mail, deviceInfo })
	});
	const data = await response.json().catch(() => null);
	return { ok: response.ok, status: response.status, data };
}