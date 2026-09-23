import React from 'react';

export default function ConfirmModal({ confirmModalOpen, setConfirmModalOpen, showToast }) {
	return (
		<div className={`overlay ${confirmModalOpen ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setConfirmModalOpen(false); }}>
			<div className="modal confirm-modal">
				<h3>Delete your account?</h3>
				<p className="sub">This can't be undone. All your subscription data will be permanently removed.</p>
				<div className="modal-actions">
					<button className="btn btn-ghost" onClick={() => setConfirmModalOpen(false)}>Keep it</button>
					<button className="btn btn-danger" onClick={() => { setConfirmModalOpen(false); showToast('Account deletion cancelled in this preview.'); }} style={{ background: 'var(--danger)', color: '#1a0605', borderColor: 'var(--danger)' }}>Delete</button>
				</div>
			</div>
		</div>
	);
}
