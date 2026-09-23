import sessionConfig from '../configs/sessionConfig';

const SESSION_KEY = 'kept_session';

export function saveSession() {
    const session = {
        loggedInAt: Date.now(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function isSessionValid() {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return false;

    try {
        const { loggedInAt } = JSON.parse(raw);
        const durationMs = sessionConfig.SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;
        return Date.now() - loggedInAt < durationMs;
    } catch {
        return false;
    }
}

export function clearSession() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('kept_user');
}
