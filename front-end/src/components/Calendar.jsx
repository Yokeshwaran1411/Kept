import React, { useState } from 'react';

export default function Calendar({ subscriptions }) {
	const [currentDate, setCurrentDate] = useState(new Date());
	const today = new Date();

	const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
	const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

	const days = [];
	for (let i = 0; i < firstDayOfMonth; i++) {
		days.push(null);
	}
	for (let i = 1; i <= daysInMonth; i++) {
		days.push(i);
	}

	const getRenewalsForDay = (day) => {
		if (!day) return [];

		return subscriptions.filter(sub => {
			const renewDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + sub.renewIn);
			return renewDate.getMonth() === currentDate.getMonth() && renewDate.getDate() === day && renewDate.getFullYear() === currentDate.getFullYear();
		});
	};

	const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
	const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	return (
		<div className="page active">
			<div className="section-head" style={{ marginTop: '6px' }}>
				<div><h2 style={{ fontSize: '20px' }}>Calendar</h2><div className="sub">Your subscription renewals at a glance.</div></div>
			</div>

			<div className="card" style={{ padding: '24px' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
					<button className="icon-btn" onClick={prevMonth}>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
					</button>
					<h3 style={{ margin: 0, fontSize: '18px' }}>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
					<button className="icon-btn" onClick={nextMonth}>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
					</button>
				</div>

				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 'clamp(4px, 1vw, 10px)', textAlign: 'center', marginBottom: '10px', color: 'var(--text-faint)', fontSize: '13px', fontWeight: 600 }}>
					<div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
				</div>

				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 'clamp(4px, 1vw, 10px)' }}>
					{days.map((day, index) => {
						const renewals = getRenewalsForDay(day);
						const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

						return (
							<div key={index} style={{
								minHeight: 'clamp(50px, 10vw, 80px)',
								background: day ? 'var(--surface-2)' : 'transparent',
								border: day ? (isToday ? '1px solid var(--accent)' : '1px solid var(--border)') : 'none',
								boxShadow: isToday ? '0 0 0 1px var(--accent) inset' : 'none',
								borderRadius: 'var(--radius-sm)',
								padding: 'clamp(4px, 1vw, 8px)',
								position: 'relative',
								overflow: 'hidden'
							}}>
								{day && (
									<>
										<div style={{
											fontSize: '14px',
											fontWeight: 600,
											color: isToday ? 'var(--accent)' : 'var(--text-muted)',
											marginBottom: '8px'
										}}>
											{day}
										</div>
										<div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
											{renewals.map(sub => (
												<div key={sub.id} style={{
													background: 'rgba(61,220,151,0.15)',
													color: 'var(--accent)',
													fontSize: '11px',
													padding: '4px 6px',
													borderRadius: '4px',
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
													cursor: 'pointer'
												}} title={`${sub.name} - ₹${sub.price}`}>
													{sub.name}
												</div>
											))}
										</div>
									</>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
