import React from 'react';
import SubCard from './SubCard';
import EmptySubscriptions from './EmptySubscriptions';

export default function Dashboard({ subscriptions, expandedCards, toggleCard, setActivePage, setAddModalOpen, onEdit, onDelete }) {
	if (!subscriptions || subscriptions.length === 0) {
		return (
			<div className="page active empty-page">
				<EmptySubscriptions setAddModalOpen={setAddModalOpen} />
			</div>
		);
	}

	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return 'Good morning 👋';
		if (hour < 18) return 'Good afternoon 👋';
		return 'Good evening 👋';
	};

	const upcoming = [...subscriptions].sort((a, b) => (a.renewIn || 0) - (b.renewIn || 0)).slice(0, 4);
	const dateLabels = ['TODAY', 'SEP 05', 'SEP 12', 'OCT 01'];

	return (
		<div className="page active">
			<div className="greeting">
				<h1>{getGreeting()}</h1>
				<p>Here's what's happening with your subscriptions.</p>
			</div>
			<div className="stat-grid stagger">
				<div className="card stat-card">
					<div className="label">Monthly spending</div>
					<div className="value mono">₹8,420</div>
					<div className="delta up">↑ 8.4% from last month</div>
				</div>
				<div className="card stat-card">
					<div className="label">Active subscriptions</div>
					<div className="value mono">12</div>
					<div className="delta">2 added this month</div>
				</div>
				<div className="card stat-card">
					<div className="label">Coming up</div>
					<div className="value mono">₹1,249</div>
					<div className="delta">Next 7 days</div>
				</div>
				<div className="card stat-card">
					<div className="label">Estimated yearly</div>
					<div className="value mono">₹101,040</div>
					<div className="delta">Based on your current subscriptions</div>
				</div>
			</div>

			<div className="dash-grid">
				<div>
					<div className="section-head">
						<div><h2>Your subscriptions</h2><div className="sub">Tap a card for the details behind it.</div></div>
						<button className="link-quiet" onClick={() => setActivePage('subscriptions')}>View all →</button>
					</div>
					<div className="sub-grid">
				{subscriptions.slice(0, 4).map(s => <SubCard key={s.id} s={s} isOpen={expandedCards[s.id]} toggleCard={toggleCard} onEdit={onEdit} onDelete={onDelete} />)}
					</div>

					<div className="section-head">
						<div><h2>You might want to know</h2></div>
					</div>
					<div className="insight-card card"><span className="e">💡</span><p>You spent ₹420 more on subscriptions this month than last month.</p></div>
					<div className="insight-card card"><span className="e">💡</span><p>Netflix is your most expensive subscription right now.</p></div>
					<div className="insight-card card"><span className="e">💡</span><p>You have 3 renewals coming up this week — nothing needs action yet.</p></div>
				</div>

				<div>
					<div className="section-head">
						<div><h2>Coming up</h2><div className="sub">Here's what will renew soon.</div></div>
					</div>
					<div className="card timeline-card">
						{upcoming.map((s, i) => {
							const price = Number(s.duration || s.price || 0);
							const renewIn = s.renewIn || 0;
							return (
								<div className="tl-item" key={i}>
									<div className="tl-dot"></div>
									<div style={{ flex: 1 }}>
										<div className="tl-date">{dateLabels[i] || ''}</div>
										<div className="tl-row"><span className="tl-name">{s.name}</span><span className="tl-price mono">₹{price}</span></div>
										<div className="tl-when">{renewIn === 0 ? 'Renewing today' : `In ${renewIn} days`}</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
