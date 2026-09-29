import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import EmptySubscriptions from './EmptySubscriptions';

const COLORS = ['#3ddc97', '#2bb97a', '#22c17e', '#0f7a52', '#e5a95f', '#e5695f'];

const mockTrendData = [
	{ month: 'Apr', spend: 7200 },
	{ month: 'May', spend: 7450 },
	{ month: 'Jun', spend: 7450 },
	{ month: 'Jul', spend: 8000 },
	{ month: 'Aug', spend: 8150 },
	{ month: 'Sep', spend: 8420 },
];

export default function Analytics({ activePage, subscriptions, setAddModalOpen }) {
	if (!subscriptions || subscriptions.length === 0) {
		return (
			<div className="page active empty-page">
				<EmptySubscriptions setAddModalOpen={setAddModalOpen} />
			</div>
		);
	}
	const { total, categories, highestCategory, avgSubscription } = useMemo(() => {
		let t = 0;
		const cats = {};
		subscriptions.forEach(s => {
			const price = Number(s.duration || s.price || 0);
			const category = s.type || s.category || 'General';
			t += price;
			if (!cats[category]) cats[category] = { amount: 0, items: [] };
			cats[category].amount += price;
			cats[category].items.push(s);
		});

		const sortedCats = Object.entries(cats).map(([name, data]) => ({
			name,
			value: data.amount,
			amount: data.amount,
			items: data.items,
			percent: Math.round((data.amount / (t || 1)) * 100)
		})).sort((a, b) => b.amount - a.amount);

		const highest = sortedCats[0] ? sortedCats[0].name : 'N/A';
		const avg = subscriptions.length ? Math.round(t / subscriptions.length) : 0;

		return { total: t, categories: sortedCats, highestCategory: highest, avgSubscription: avg };
	}, [subscriptions]);

	if (activePage !== 'analytics') return null;

	return (
		<div className="page active">
			<div className="section-head" style={{ marginTop: '6px' }}>
				<div><h2 style={{ fontSize: '20px' }}>Analytics Dashboard</h2><div className="sub">Visualizing your spending patterns.</div></div>
			</div>

			{/* Mini Stat Widgets */}
			<div className="sub-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', marginBottom: '22px' }}>
				<div className="card" style={{ padding: '16px' }}>
					<div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Total Monthly</div>
					<div className="mono" style={{ fontSize: '24px', fontWeight: 600 }}>₹{total.toLocaleString()}</div>
				</div>
				<div className="card" style={{ padding: '16px' }}>
					<div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Top Category</div>
					<div style={{ fontSize: '20px', fontWeight: 600 }}>{highestCategory}</div>
				</div>
				<div className="card" style={{ padding: '16px' }}>
					<div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Avg. Subscription</div>
					<div className="mono" style={{ fontSize: '24px', fontWeight: 600 }}>₹{avgSubscription.toLocaleString()}</div>
				</div>
			</div>

			<div className="dash-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '22px' }}>
				{/* Doughnut Chart */}
				<div className="card" style={{ padding: '18px 22px', height: '320px', display: 'flex', flexDirection: 'column' }}>
					<h3 style={{ margin: '0 0 16px 0', fontSize: '15px' }}>Category Distribution</h3>
					<div style={{ flex: 1, minHeight: 0 }}>
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={categories}
									innerRadius={60}
									outerRadius={100}
									paddingAngle={5}
									dataKey="value"
									stroke="none"
								>
									{categories.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip
									formatter={(value) => `₹${value.toLocaleString()}`}
									contentStyle={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text)' }}
									itemStyle={{ color: 'var(--accent)' }}
								/>
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* 6-Month Trend Bar Chart */}
				<div className="card" style={{ padding: '18px 22px', height: '320px', display: 'flex', flexDirection: 'column' }}>
					<h3 style={{ margin: '0 0 16px 0', fontSize: '15px' }}>6-Month Trend</h3>
					<div style={{ flex: 1, minHeight: 0, marginLeft: '-15px' }}>
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={mockTrendData}>
								<CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
								<XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
								<YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={val => `₹${val}`} />
								<Tooltip
									cursor={{ fill: 'var(--surface-3)' }}
									contentStyle={{ backgroundColor: 'var(--surface-2)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text)' }}
									itemStyle={{ color: 'var(--accent)' }}
								/>
								<Bar dataKey="spend" fill="var(--accent)" radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>

			<div className="section-head">
				<div><h2 style={{ fontSize: '18px' }}>Detailed Breakdown</h2></div>
			</div>
			<div className="dash-grid" style={{ gridTemplateColumns: '1fr', gap: '16px' }}>
				{categories.map((c, idx) => (
					<div key={c.name} className="card" style={{ padding: '16px', borderLeft: `4px solid ${COLORS[idx % COLORS.length]}` }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
							<h3 style={{ margin: 0, fontSize: '15px' }}>{c.name}</h3>
							<div className="mono" style={{ fontSize: '15px', fontWeight: 600 }}>₹{c.amount.toLocaleString()}</div>
						</div>
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
							{c.items.map(item => (
								<div key={item.id} style={{ padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
									<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
										<span style={{ fontWeight: 600, fontSize: '14px' }}>{item.name}</span>
										<span className="mono" style={{ fontSize: '14px' }}>₹{item.price}</span>
									</div>
									<div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.plan} plan • Renews in {item.renewIn} days</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
