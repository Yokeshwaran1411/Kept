import React, { useState } from 'react';

export default function Auth({ onLogin }) {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [error, setError] = useState('');
	const [animating, setAnimating] = useState(false);

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
			setError('Please fill in all fields');
			return;
		}

		try {
			const endpoint = isLogin ? `${import.meta.env.VITE_API_BASE_URL}/api/auth/login` : `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`;
			const payload = isLogin ? { mail: email, password } : { name, mail: email, password };

			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			const data = await response.json().catch(() => null);

			if (response.ok) {
				if (data && data.user) {
					localStorage.setItem('kept_user', JSON.stringify(data.user));
				}
				onLogin();
			} else {
				setError(data?.error || data?.message || 'Authentication failed. Please try again.');
			}
		} catch (err) {
			console.error('Authentication error:', err);
			setError('Network error. Is the backend running?');
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