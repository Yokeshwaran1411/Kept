import React, { useState, useEffect } from 'react';

export default function Profile({ setConfirmModalOpen }) {
	const [user, setUser] = useState({ name: 'Guest', mail: '' });
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editForm, setEditForm] = useState({ name: '', mail: '' });

	useEffect(() => {
		const storedUser = localStorage.getItem('kept_user');
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, []);

	// Helper to get initials from name
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

	const [editError, setEditError] = useState('');

	const handleSaveDetails = async () => {
		setEditError('');
		const storedUser = JSON.parse(localStorage.getItem('kept_user')) || {};

		try {
			const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/update`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: storedUser.id, name: editForm.name, mail: editForm.mail })
			});

			const data = await response.json().catch(() => null);

			if (response.ok) {
				// Update local state and localStorage on success
				setUser(editForm);
				localStorage.setItem('kept_user', JSON.stringify({ ...storedUser, ...editForm }));
				setIsEditModalOpen(false);
			} else {
				setEditError(data?.error || 'Failed to update. Please try again.');
			}
		} catch (err) {
			console.error('Update error:', err);
			setEditError('Network error. Is the backend running?');
		}
	};

	return (
		<div className="page active">
			<div className="section-head" style={{ marginTop: '6px' }}><div><h2 style={{ fontSize: '20px' }}>Your profile</h2><div className="sub">Manage your account and personal information.</div></div></div>
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
					<div className="list-row"><span>Password</span><button className="link-quiet">Change</button></div>
					<div className="list-row"><span>Login history</span><button className="link-quiet">View</button></div>
					<div className="list-row"><span>Share</span><button className="link-quiet">Share</button></div>
				</div>
				<div className="card setting-card">
					<div style={{ fontWeight: 600, fontSize: '14.5px', marginBottom: '8px' }}>Connected accounts</div>
					<div className="list-row"><span>Google</span><span style={{ color: 'var(--accent)', fontSize: '12.5px' }}>Connected</span></div>
					<div className="list-row"><span>GitHub</span><button className="link-quiet">Connect</button></div>
					<div className="list-row"><span>Apple</span><button className="link-quiet">Connect</button></div>
				</div>
			</div>

			<div className="card setting-card" style={{ marginTop: '16px' }}>
				<div style={{ fontWeight: 600, fontSize: '14.5px', marginBottom: '8px' }}>Account</div>
				<div className="list-row"><span>Export your data</span><button className="link-quiet">Export</button></div>
				<div className="list-row"><span>Sign out of all devices</span><button className="link-quiet">Sign out</button></div>
				<div className="list-row"><span>Delete account</span><button className="btn btn-danger" onClick={() => setConfirmModalOpen(true)} style={{ padding: '5px 12px', fontSize: '12.5px' }}>Delete</button></div>
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
		</div>
	);
}
