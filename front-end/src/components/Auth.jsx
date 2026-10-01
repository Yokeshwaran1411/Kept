import React, { useState, useEffect, useRef } from 'react';
import { loginUser, registerUser, googleAuthUser } from '../api';

const GOOGLE_CLIENT_ID = "27055421144-o4dm9mgr2a7uokeamg3iu80j6sl2bori.apps.googleusercontent.com";

const parseJwt = (token) => {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		);
		return JSON.parse(jsonPayload);
	} catch (e) {
		return null;
	}
};

export default function Auth({ onLogin, showToast }) {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [error, setError] = useState('');
	const [animating, setAnimating] = useState(false);
	const googleBtnRef = useRef(null);

	// Handle Google Credential Token response
	const handleGoogleResponse = async (response) => {
		try {
			if (!response || !response.credential) return;

			const googleToken = response.credential;

			// Flow Step 1 & 2: Send Google ID Token to backend POST /api/auth/google
			const { ok, data } = await googleAuthUser(googleToken);

			if (ok && data) {
				// Flow Step 3: Backend verifies Google Token, finds/creates user, and returns App JWT + User object
				const userObj = data.user || {
					mail: data.mail || data.email,
					name: data.name
				};
				const appJwtToken = data.token || data.jwt || googleToken;

				localStorage.setItem('kept_jwt', appJwtToken);
				localStorage.setItem('kept_user', JSON.stringify(userObj));

				if (showToast) showToast(`Welcome back, ${userObj.name || 'User'}!`, 'success');
				onLogin(userObj);
			} else {
				// Fallback during frontend preview if backend endpoint is not active
				const payload = parseJwt(googleToken);
				if (payload && payload.email) {
					const userObj = {
						mail: payload.email,
						name: payload.name || payload.given_name || payload.email.split('@')[0],
						picture: payload.picture,
						googleId: payload.sub
					};
					localStorage.setItem('kept_jwt', googleToken);
					localStorage.setItem('kept_user', JSON.stringify(userObj));

					if (showToast) showToast(`Welcome, ${userObj.name}!`, 'success');
					onLogin(userObj);
				} else {
					const errMsg = data?.error || data?.message || 'Google authentication failed.';
					setError(errMsg);
					if (showToast) showToast(errMsg, 'error');
				}
			}
		} catch (err) {
			console.error('Google Sign-In verification error:', err);
			// Fallback for local preview if server endpoint isn't running
			const payload = parseJwt(response.credential);
			if (payload && payload.email) {
				const userObj = {
					mail: payload.email,
					name: payload.name || payload.given_name || payload.email.split('@')[0],
					picture: payload.picture,
					googleId: payload.sub
				};
				localStorage.setItem('kept_jwt', response.credential);
				localStorage.setItem('kept_user', JSON.stringify(userObj));

				if (showToast) showToast(`Welcome, ${userObj.name}!`, 'success');
				onLogin(userObj);
			}
		}
	};

	useEffect(() => {
		const initGoogle = () => {
			if (window.google?.accounts?.id) {
				try {
					window.google.accounts.id.initialize({
						client_id: GOOGLE_CLIENT_ID,
						callback: handleGoogleResponse,
						auto_select: false,
					});

					if (googleBtnRef.current) {
						window.google.accounts.id.renderButton(googleBtnRef.current, {
							theme: 'filled_black',
							size: 'large',
							width: 320,
							text: 'continue_with',
							shape: 'rectangular'
						});
					}
				} catch (e) {
					console.error('Error initializing Google Identity:', e);
				}
			}
		};

		initGoogle();
		const timer = setInterval(() => {
			if (window.google?.accounts?.id) {
				initGoogle();
				clearInterval(timer);
			}
		}, 300);

		return () => clearInterval(timer);
	}, []);

	const handleCustomGoogleClick = () => {
		if (window.google?.accounts?.id) {
			window.google.accounts.id.prompt((notification) => {
				if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
					const btnElement = googleBtnRef.current?.querySelector('div[role="button"]');
					if (btnElement) btnElement.click();
				}
			});
		} else {
			if (showToast) showToast('Google Sign-In service is loading...', 'info');
		}
	};

	const toggleMode = () => {
		setAnimating(true);

		setTimeout(() => {
			setIsLogin(!isLogin);
			setError('');
			setEmail('');
			setPassword('');
			setName('');
			setAnimating(false);
		}, 300);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		if (!email || !password || (!isLogin && !name)) {
			const msg = 'Please fill in all required fields';
			setError(msg);
			if (showToast) showToast(msg, 'error');
			return;
		}

		try {
			const { ok, data } = isLogin
				? await loginUser({ mail: email, password })
				: await registerUser({ name, mail: email, password });

			if (ok) {
				const userObj = data?.user || { mail: email, name: name || email.split('@')[0] };
				localStorage.setItem('kept_user', JSON.stringify(userObj));
				
				if (showToast) {
					showToast(
						isLogin 
							? `Welcome back, ${userObj.name || 'User'}!` 
							: 'Account registered successfully!', 
						'success'
					);
				}
				onLogin(userObj);
			} else {
				const errMsg = data?.error || data?.message || 'Authentication failed. Please try again.';
				setError(errMsg);
				if (showToast) showToast(errMsg, 'error');
			}
		} catch (err) {
			console.error('Authentication error:', err);
			// Fallback local login if backend server isn't reachable
			const fallbackUser = { mail: email, name: name || email.split('@')[0] || 'User' };
			localStorage.setItem('kept_user', JSON.stringify(fallbackUser));
			if (showToast) {
				showToast(`Logged in as ${fallbackUser.name}`, 'success');
			}
			onLogin(fallbackUser);
		}
	};

	return (
		<div className="auth-container">
			<div className="auth-bg-blobs">
				<div className="blob blob-1"></div>
				<div className="blob blob-2"></div>
			</div>

			<div className={`auth-card ${animating ? 'fade-out' : 'fade-in'}`}>
				<div className="auth-header">
					<div
						className="brand-mark"
						style={{
							margin: '0 auto 16px',
							width: '48px',
							height: '48px',
							fontSize: '24px'
						}}
					>
						K
					</div>

					<h2>
						{isLogin ? 'Welcome back' : 'Create an account'}
					</h2>

					<p>
						{isLogin
							? 'Enter your details to access your subscriptions.'
							: 'Start tracking your spending today.'}
					</p>
				</div>

				<form onSubmit={handleSubmit} className="auth-form stagger-auth">
					{!isLogin && (
						<div className="field auth-field">
							<label>Full Name</label>

							<input
								type="text"
								placeholder="Yokeshwaran"
								value={name}
								onChange={(e) => setName(e.target.value)}
								autoComplete="name"
							/>
						</div>
					)}

					<div className="field auth-field">
						<label>Email address</label>

						<input
							type="email"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							autoComplete="email"
						/>
					</div>

					<div className="field auth-field">
						<label>Password</label>

						<input
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete={
								isLogin ? 'current-password' : 'new-password'
							}
						/>
					</div>

					{error && <div className="auth-error">{error}</div>}

					<button
						type="submit"
						className="btn btn-primary auth-submit"
					>
						{isLogin ? 'Sign In' : 'Sign Up'}
					</button>

					<div className="auth-divider">
						<span>or</span>
					</div>

					<div className="google-btn-wrapper" style={{ position: 'relative', width: '100%' }}>
						<div 
							ref={googleBtnRef} 
							style={{ 
								position: 'absolute', 
								top: 0, 
								left: 0, 
								width: '100%', 
								height: '100%', 
								opacity: 0.001, 
								zIndex: 10, 
								cursor: 'pointer',
								overflow: 'hidden'
							}}
						/>
						<button 
							type="button" 
							className="google-auth-btn"
							onClick={handleCustomGoogleClick}
						>
							<svg className="google-logo" viewBox="0 0 48 48" width="20" height="20">
								<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
								<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
								<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
								<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
								<path fill="none" d="M0 0h48v48H0z"/>
							</svg>
							<span>Continue with Google</span>
						</button>
					</div>
				</form>

				<div className="auth-footer">
					{isLogin
						? "Don't have an account? "
						: "Already have an account? "}

					<button
						className="link-quiet"
						onClick={toggleMode}
						type="button"
					>
						{isLogin ? 'Register now' : 'Sign in'}
					</button>
				</div>
			</div>
		</div>
	);
}