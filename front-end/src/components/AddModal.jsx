import React, { useState } from 'react';

export default function AddModal({ addModalOpen, setAddModalOpen, showToast }) {
	const [advFieldsOpen, setAdvFieldsOpen] = useState(false);

	return (
		<div className={`overlay ${addModalOpen ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setAddModalOpen(false); }}>
			<div className="modal">
				<h3>Add a subscription</h3>
				<p className="sub">Just the basics for now — you can fill in more later.</p>
				<div className="field">
					<label>What are you subscribing to?</label>
					<input type="text" placeholder="Search Netflix, Spotify, GitHub…" />
				</div>
				<div className="field">
					<label>How much does it cost?</label>
					<input type="text" placeholder="₹ 0" />
				</div>
				<div className="field">
					<label>When does it renew?</label>
					<input type="date" />
				</div>
				<button className="adv-toggle" onClick={() => setAdvFieldsOpen(!advFieldsOpen)}>
					{advFieldsOpen ? '– Hide details' : '+ Add more details'}
				</button>
				<div className={`adv-fields ${advFieldsOpen ? 'open' : ''}`}>
					<div className="field"><label>Category</label><input type="text" placeholder="Entertainment" /></div>
					<div className="field"><label>Payment method</label><input type="text" placeholder="Visa •••• 4214" /></div>
					<div className="field"><label>Notes</label><input type="text" placeholder="Optional" /></div>
				</div>
				<div className="modal-actions">
					<button className="btn btn-ghost" onClick={() => setAddModalOpen(false)}>Cancel</button>
					<button className="btn btn-primary" onClick={() => { setAddModalOpen(false); showToast("You're all set! Subscription added."); }}>Add subscription</button>
				</div>
			</div>
		</div>
	);
}
