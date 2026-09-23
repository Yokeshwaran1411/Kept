import React from 'react';

export default function BottomNav({ activePage, setActivePage }) {
	const items = [
		{ id: 'dashboard', label: 'Home', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9.5 12 3l9 6.5" /><path d="M5 10v10h14V10" /></svg> },
		{ id: 'subscriptions', label: 'Subs', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="6" rx="1.5" /><rect x="3" y="14" width="18" height="6" rx="1.5" /></svg> },
		{ id: 'analytics', label: 'Stats', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20V10" /><path d="M12 20V4" /><path d="M20 20v-7" /></svg> },
		{ id: 'profile', label: 'Profile', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" /></svg> },
		{ id: 'settings', label: 'More', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /></svg> }
	];

	return (
		<div className="bottom-nav">
			{items.map(item => (
				<button key={item.id} className={activePage === item.id ? 'active' : ''} onClick={() => setActivePage(item.id)}>
					{item.icon}
					{item.label}
				</button>
			))}
		</div>
	);
}
