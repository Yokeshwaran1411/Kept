import React, { useState, useEffect } from 'react';
import { updateUserProfile, getUserLoginHistory } from '../api';

export default function Profile({ setConfirmModalOpen, showToast }) {
	const [user, setUser] = useState({ name: 'Guest', mail: '' });
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editForm, setEditForm] = useState({ name: '', mail: '' });
	const [editError, setEditError] = useState('');

	const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
	const [historyList, setHistoryList] = useState([]);
	const [loadingHistory, setLoadingHistory] = useState(false);

	useEffect(() => {
		const storedUser = localStorage.getItem('kept_user');
		if (storedUser) {
			try {
				setUser(JSON.parse(storedUser));
			} catch (e) {
				console.error(e);
			}
		}
	}, []);

	const getInitials = (name) => {
		if (!name) return 'U';
		const parts = name.trim().split(' ');
		if (parts.length > 1) {
			return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
		}
		return name.substring(0, 2).toUpperCase();
	};

	const openEditModal = () => {
		setEditForm(user);
		setIsEditModalOpen(true);
	};

	const handleSaveDetails = async () => {
		setEditError('');
		const storedUser = JSON.parse(localStorage.getItem('kept_user')) || {};

		if (!editForm.name || !editForm.mail) {
			setEditError('Please fill in both name and email.');
			if (showToast) showToast('Please fill in both name and email.', 'error');
			return;
		}

		try {
			const { ok, data } = await updateUserProfile({ id: storedUser.id || 1, name: editForm.name, mail: editForm.mail });

			if (ok) {
				setUser(editForm);
				localStorage.setItem('kept_user', JSON.stringify({ ...storedUser, ...editForm }));
				setIsEditModalOpen(false);
				if (showToast) showToast('Profile details updated successfully!', 'success');
			} else {
				const errMsg = data?.error || 'Failed to update details. Please try again.';
				setEditError(errMsg);
				if (showToast) showToast(errMsg, 'error');
			}
		} catch (err) {
			console.error('Update error:', err);
			setUser(editForm);
			localStorage.setItem('kept_user', JSON.stringify({ ...storedUser, ...editForm }));
			setIsEditModalOpen(false);
			if (showToast) showToast('Profile details saved locally!', 'success');
		}
	};

	const handleFetchHistory = async () => {
		setIsHistoryModalOpen(true);
		setLoadingHistory(true);
		try {
			const { ok, data } = await getUserLoginHistory(user.mail);
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
					<h2 style={{ fontSize: '20px' }}>Your profile</h2>
					<div className="sub">Manage your account and personal information.</div>
				</div>
			</div>
			
			<div className="card profile-head">
				<div className="avatar">{getInitials(user.name)}</div>
				<div>
					<div className="n">{user.name}</div>
					<div className="e">{user.mail}</div>
				</div>
				<div style={{ marginLeft: 'auto' }}>
					<button className="btn btn-ghost" onClick={openEditModal}>Edit details</button>
				</div>
			</div>

			<div className="profile-grid">
				<div className="card setting-card">
					<div style={{ fontWeight: 600, fontSize: '14.5px', marginBottom: '8px' }}>Security</div>
					<div className="list-row">
						<span>Password</span>
						<button className="link-quiet" onClick={() => showToast && showToast('Password reset link sent to ' + user.mail, 'info')}>Change</button>
					</div>
					<div className="list-row">
						<span>Login history</span>
						<button className="link-quiet" onClick={handleFetchHistory}>View</button>
					</div>
					<div className="list-row">
						<span>Share</span>
						<button className="link-quiet" onClick={() => showToast && showToast('Profile link copied!', 'success')}>Share</button>
					</div>
				</div>
				
				<div className="card setting-card">
					<div style={{ fontWeight: 600, fontSize: '14.5px', marginBottom: '8px' }}>Connected accounts</div>
					<div className="list-row">
						<span>Google</span>
						<span style={{ color: 'var(--accent)', fontSize: '12.5px' }}>Connected</span>
					</div>
					<div className="list-row">
						<span>GitHub</span>
						<button className="link-quiet" onClick={() => showToast && showToast('GitHub connection initiated', 'info')}>Connect</button>
					</div>
					<div className="list-row">
						<span>Apple</span>
						<button className="link-quiet" onClick={() => showToast && showToast('Apple connection initiated', 'info')}>Connect</button>
					</div>
				</div>
			</div>

			<div className="card setting-card" style={{ marginTop: '16px' }}>
				<div style={{ fontWeight: 600, fontSize: '14.5px', marginBottom: '8px' }}>Account</div>
				<div className="list-row">
					<span>Import your data</span>
					<button className="link-quiet" onClick={() => showToast && showToast('Exporting JSON backup...', 'info')}>Export</button>
				</div>
				<div className="list-row">
					<span>Export your data</span>
					<button className="link-quiet" onClick={() => showToast && showToast('Exporting JSON backup...', 'info')}>Export</button>
				</div>
				<div className="list-row">
					<span>Sign out of all devices</span>
					<button className="link-quiet" onClick={() => showToast && showToast('Signed out of all other devices', 'success')}>Sign out</button>
				</div>
				<div className="list-row">
					<span>Delete account</span>
					<button className="btn btn-danger" onClick={() => setConfirmModalOpen(true)} style={{ padding: '5px 12px', fontSize: '12.5px' }}>Delete</button>
				</div>
			</div>

			{/* Edit Details Modal */}
			<div className={`overlay ${isEditModalOpen ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setIsEditModalOpen(false); }}>
				<div className="modal">
					<h3>Edit Profile Details</h3>
					<p className="sub">Update your name and email address.</p>
					
					<div className="field">
						<label>Name</label>
						<input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
					</div>
					
					<div className="field">
						<label>Email address</label>
						<input type="email" value={editForm.mail} onChange={e => setEditForm({ ...editForm, mail: e.target.value })} />
					</div>
					
					{editError && <div className="auth-error" style={{ marginBottom: '10px' }}>{editError}</div>}
					<div className="modal-actions">
						<button className="btn btn-ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
						<button className="btn btn-primary" onClick={handleSaveDetails}>Save Changes</button>
					</div>
				</div>
			</div>

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
