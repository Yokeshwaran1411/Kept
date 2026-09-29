import React from 'react';

export default function EmptySubscriptions({ setAddModalOpen, onAddSubscription, userEmail, onRefetch, isFetching }) {
	const popularPresets = [
		{ name: 'Netflix', plan: 'Premium', price: 649, renewIn: 15, status: 'Active', category: 'Entertainment', method: 'Visa •••• 4214', icon: '📺' },
		{ name: 'Spotify', plan: 'Individual', price: 119, renewIn: 28, status: 'Active', category: 'Entertainment', method: 'Mastercard •••• 1092', icon: '🎵' },
		{ name: 'GitHub Pro', plan: 'Developer', price: 400, renewIn: 12, status: 'Active', category: 'Development', method: 'Visa •••• 8821', icon: '💻' },
		{ name: 'iCloud+', plan: '200GB', price: 219, renewIn: 5, status: 'Active', category: 'Cloud', method: 'Apple Pay', icon: '☁️' },
		{ name: 'YouTube Premium', plan: 'Family', price: 189, renewIn: 20, status: 'Active', category: 'Entertainment', method: 'Visa •••• 4214', icon: '🎬' },
	];

	const handleQuickAdd = (preset) => {
		const newSub = {
			id: Date.now(),
			name: preset.name,
			plan: preset.plan,
			price: preset.price,
			renewIn: preset.renewIn,
			status: preset.status,
			category: preset.category,
			method: preset.method,
			started: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
		};
		onAddSubscription(newSub);
	};

	return (
		<div className="empty-sub-wrapper">
			<div className="api-status-bar">
				<div className="api-tag">
					<span className="method-get">GET</span>
					<code className="api-url">/api/subscriptions?mail={userEmail || 'user@example.com'}</code>
				</div>
				<div className="api-result-badge">
					<span className="dot-pulse"></span>
					Backend Response: <code>200 OK</code> (0 items)
				</div>
				<button 
					className={`btn btn-ghost btn-xs refetch-btn ${isFetching ? 'spinning' : ''}`}
					onClick={onRefetch}
					disabled={isFetching}
					title="Trigger GET call to backend"
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M21.5 2v6h-6M2.5 22v-6h6" />
						<path d="M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
					</svg>
					{isFetching ? 'Fetching...' : 'Re-fetch GET'}
				</button>
			</div>

			<div className="empty-sub-card">
				<div className="empty-hero-glow"></div>
				<div className="empty-hero-art">
					<div className="orbit-ring ring-outer"></div>
					<div className="orbit-ring ring-inner"></div>
					<div className="float-card float-1">
						<span className="emoji">📺</span>
						<span className="txt">Netflix</span>
					</div>
					<div className="float-card float-2">
						<span className="emoji">🎵</span>
						<span className="txt">Spotify</span>
					</div>
					<div className="float-card float-3">
						<span className="emoji">💻</span>
						<span className="txt">GitHub</span>
					</div>
					<div className="float-card float-4">
						<span className="emoji">☁️</span>
						<span className="txt">iCloud+</span>
					</div>

					<div className="center-node">
						<div className="node-icon">
							<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
								<rect x="3" y="4" width="18" height="6" rx="1.5" />
								<rect x="3" y="14" width="18" height="6" rx="1.5" />
								<path d="M12 10v4" strokeDasharray="2 2" />
							</svg>
						</div>
						<span className="zero-pill">0 Active</span>
					</div>
				</div>

				<div className="empty-content">
					<div className="empty-badge-pill">✨ Empty Subscription Inbox</div>
					<h2 className="empty-title">You have no subscriptions added yet</h2>
					<p className="empty-desc">
						It looks like your subscription list is empty for <strong style={{ color: 'var(--accent)' }}>{userEmail || 'your account'}</strong>.
						Add your recurring services here to track billing cycles, receive renewal alerts, and stop money leaks.
					</p>

					<div className="empty-actions">
						<button className="btn btn-primary btn-glow" onClick={() => setAddModalOpen(true)}>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
								<line x1="12" y1="5" x2="12" y2="19" />
								<line x1="5" y1="12" x2="19" y2="12" />
							</svg>
							Add your first subscription
						</button>
					</div>

					<div className="quick-presets-section">
						<div className="presets-label">Or quick-add a popular subscription in 1-click:</div>
						<div className="preset-chips">
							{popularPresets.map((p) => (
								<button 
									key={p.name}
									className="preset-chip"
									onClick={() => handleQuickAdd(p)}
								>
									<span className="chip-icon">{p.icon}</span>
									<span className="chip-name">{p.name}</span>
									<span className="chip-price">₹{p.price}/mo</span>
									<span className="chip-plus">+</span>
								</button>
							))}
						</div>
					</div>
				</div>
			</div>

			<div className="empty-features-grid">
				<div className="feature-card">
					<div className="feature-icon">🔔</div>
					<div className="feature-title">Smart Renewal Alerts</div>
					<div className="feature-desc">Never get surprised by an auto-renew charge again. Get timely reminders before payment dates.</div>
				</div>
				<div className="feature-card">
					<div className="feature-icon">📊</div>
					<div className="feature-title">Spending Analytics</div>
					<div className="feature-desc">Get visual monthly and yearly spending breakdowns to optimize your subscriptions.</div>
				</div>
				<div className="feature-card">
					<div className="feature-icon">🛡️</div>
					<div className="feature-title">Complete Privacy</div>
					<div className="feature-desc">Your subscriptions and payment notes are stored safely for your email address only.</div>
				</div>
			</div>
		</div>
	);
}
