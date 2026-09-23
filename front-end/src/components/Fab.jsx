import React from 'react';

export default function Fab({ fabOpen, setFabOpen, setAddModalOpen, setActivePage }) {
	return (
		<div className={`fab-wrap ${fabOpen ? 'open' : ''}`}>
			<div className="fab-menu">
				<button onClick={() => { setAddModalOpen(true); setFabOpen(false); }}>＋ Add subscription</button>
				<button>🔔 Create reminder</button>
				<button>💳 Add payment method</button>
				<button onClick={() => { setActivePage('analytics'); setFabOpen(false); }}>📊 View spending</button>
			</div>
			<button className="fab" onClick={() => setFabOpen(!fabOpen)}>
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
			</button>
		</div>
	);
}
