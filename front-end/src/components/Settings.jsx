import React, { useState } from 'react';
import { getUserLoginHistory } from '../api';

const Toggle = ({ defaultOn }) => {
	const [on, setOn] = useState(defaultOn);
	return (
		<div className={`toggle ${on ? 'on' : ''}`} onClick={() => setOn(!on)} style={{ cursor: 'pointer' }}>
			<div className="knob"></div>
		</div>
	);
};

export default function Settings({ showToast }) {
	const [activeTab, setActiveTab] = useState('Dashboard');
	const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
	const [historyList, setHistoryList] = useState([]);
	const [loadingHistory, setLoadingHistory] = useState(false);

	const tabs = ['General', 'Dashboard', 'Notifications', 'Appearance', 'Currency & Region', 'Integrations', 'Security', 'Data & Privacy'];

	const handleFetchHistory = async () => {
		setIsHistoryModalOpen(true);
		setLoadingHistory(true);
		try {
			let storedMail = '';
			try {
				const storedUser = localStorage.getItem('kept_user');
				if (storedUser) storedMail = JSON.parse(storedUser)?.mail;
			} catch (e) {
				console.error(e);
			}

			const { ok, data } = await getUserLoginHistory(storedMail);
			if (ok && data?.history) {
				setHistoryList(data.history);
			} else {
				setHistoryList([]);
			}
		} catch (err) {
			console.error('Error fetching login history:', err);
			if (showToast) showToast('Failed to load login history', 'error');
		} finally {
			setLoadingHistory(false);
		}
	};

	const formatDate = (dateStr) => {
		if (!dateStr) return 'N/A';
		try {
			const d = new Date(dateStr);
			return d.toLocaleString(undefined, {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			});
		} catch {
			return dateStr;
		}
	};

	return (
		<div className="page active">
			<div className="section-head" style={{ marginTop: '6px' }}>
				<div>
					<h2 style={{ fontSize: '20px' }}>Settings</h2>
					<div className="sub">Customize how Kept works for you.</div>
				</div>
			</div>
			
			<div className="settings-wrap">
				<div className="settings-nav">
					{tabs.map(tab => (
						<button
							key={tab}
							className={activeTab === tab ? 'active' : ''}
							onClick={() => setActiveTab(tab)}
						>
							{tab}
						</button>
					))}
				</div>
				<div>
					{activeTab === 'General' && (
						<div className="card setting-card">
							<div style={{ fontWeight: 600, fontSize: '14.5px', marginBottom: '8px' }}>General Settings</div>
							<div className="setting-row"><div><div className="t">Auto-sync across devices</div><div className="d">Keep your data synced securely.</div></div><Toggle defaultOn={true} /></div>
							<div className="setting-row"><div><div className="t">Offline mode</div><div className="d">Allow reading data without internet.</div></div><Toggle defaultOn={false} /></div>
						</div>
					)}

					{activeTab === 'Dashboard' && (
						<div className="card setting-card">
							<div style={{ fontWeight: 600, fontSize: '14.5px', marginBottom: '2px' }}>Dashboard</div>
							<div style={{ fontSize: '12.5px', color: 'var(--text-faint)', marginBottom: '6px' }}>Customize your dashboard layout</div>
							<div className="setting-row"><div><div className="t">Show monthly spending</div></div><Toggle defaultOn={true} /></div>
							<div className="setting-row"><div><div className="t">Show yearly estimate</div></div><Toggle defaultOn={true} /></div>
							<div className="setting-row"><div><div className="t">Show upcoming renewals</div></div><Toggle defaultOn={true} /></div>
						</div>
					)}

					{activeTab === 'Notifications' && (
						<div className="card setting-card">
							<div style={{ fontWeight: 600, fontSize: '14.5px', marginBottom: '8px' }}>Alerts & Emails</div>
							<div className="setting-row"><div><div className="t">Renewal reminders</div><div className="d">We'll remind you before a subscription renews.</div></div><Toggle defaultOn={true} /></div>
							<div className="setting-row"><div><div className="t">Weekly spending summary</div><div className="d">A short email every Monday with what changed.</div></div><Toggle defaultOn={false} /></div>
							<div className="setting-row"><div><div className="t">Price increase alerts</div><div className="d">We'll flag it if a subscription gets more expensive.</div></div><Toggle defaultOn={true} /></div>
						</div>
					)}

					{activeTab === 'Appearance' && (
						<div className="card setting-card">
							<div style={{ fontWeight: 600, fontSize: '14.5px', marginBottom: '8px' }}>Theme & Visuals</div>
							<div className="setting-row"><div><div className="t">Use system theme</div><div className="d">Automatically match your OS theme.</div></div><Toggle defaultOn={false} /></div>
							<div className="setting-row"><div><div className="t">Compact lists</div><div className="d">Reduce padding in subscription views.</div></div><Toggle defaultOn={false} /></div>
						</div>
					)}

					{activeTab === 'Security' && (
						<div className="card setting-card">
							<div style={{ fontWeight: 600, fontSize: '14.5px', marginBottom: '8px' }}>Security & Login Sessions</div>
							<div className="list-row">
								<span>User Login History</span>
								<button className="link-quiet" onClick={handleFetchHistory}>View History</button>
							</div>
							<div className="setting-row" style={{ marginTop: '12px' }}>
								<div>
									<div className="t">Require 2FA for logins</div>
									<div className="d">Add an extra layer of protection.</div>
								</div>
								<Toggle defaultOn={false} />
							</div>
						</div>
					)}

					{['Currency & Region', 'Integrations', 'Data & Privacy'].includes(activeTab) && (
						<div className="card setting-card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px', opacity: 0.5 }}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
							<div>Settings for {activeTab} are coming soon!</div>
						</div>
					)}
				</div>
			</div>

			{/* Login History Modal */}
			<div className={`overlay ${isHistoryModalOpen ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setIsHistoryModalOpen(false); }}>
				<div className="modal history-modal">
					<h3>User Login History</h3>
					<p className="sub">Recorded sessions from <code style={{ color: 'var(--accent)', background: 'var(--surface-3)', padding: '2px 6px', borderRadius: '4px' }}>user.user_login_history</code> table.</p>
					
					{loadingHistory ? (
						<div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
							Loading history records...
						</div>
					) : historyList.length === 0 ? (
						<div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
							No login history found.
						</div>
					) : (
						<div className="history-list">
							{historyList.map((item) => {
								const info = item.parsed_info || {};
								return (
									<div key={item.id} className="history-item">
										<div className="history-head">
											<span className="history-time">
												{formatDate(item.created_at)}
											</span>
											<span className="history-platform-badge">
												{info.platform || 'Unknown OS'}
											</span>
										</div>

										<div className="history-meta-grid">
											<div className="history-meta-field">
												<div className="history-meta-label">Timezone</div>
												<div>{info.timezone || 'N/A'}</div>
											</div>
											<div className="history-meta-field">
												<div className="history-meta-label">Resolution</div>
												<div>{info.screenResolution || 'N/A'}</div>
											</div>
											<div className="history-meta-field">
												<div className="history-meta-label">Language</div>
												<div>{info.language || 'N/A'}</div>
											</div>
											<div className="history-meta-field">
												<div className="history-meta-label">Connection</div>
												<div>{info.connectionType || 'N/A'}</div>
											</div>

											{info.userAgent && (
												<div className="history-meta-field history-useragent">
													<div className="history-meta-label">User Agent</div>
													<div>{info.userAgent}</div>
												</div>
											)}
										</div>
									</div>
								);
							})}
						</div>
					)}

					<div className="modal-actions">
						<button className="btn btn-ghost" onClick={() => setIsHistoryModalOpen(false)}>Close</button>
					</div>
				</div>
			</div>
		</div>
	);
}
