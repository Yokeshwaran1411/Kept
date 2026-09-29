import React, { useState, useEffect } from 'react';
import SubCard from './SubCard';
import EmptySubscriptions from './EmptySubscriptions';
import { getSubscriptions } from '../api';

export default function SubscriptionList({ 
	subscriptions, 
	setSubscriptions, 
	expandedCards, 
	toggleCard, 
	setAddModalOpen, 
	showToast,
	userEmail,
	onAddSubscription
}) {
	const [isFetching, setIsFetching] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('All');

	// GET Call to fetch subscriptions of user by email
	const fetchSubscriptions = async (isManual = false) => {
		setIsFetching(true);
		try {
			const emailToUse = userEmail || JSON.parse(localStorage.getItem('kept_user'))?.mail || 'user@example.com';
			const { ok, status, data } = await getSubscriptions(emailToUse);

			if (ok && data) {
				if (Array.isArray(data)) {
					setSubscriptions(data);
				} else if (data.subscriptions && Array.isArray(data.subscriptions)) {
					setSubscriptions(data.subscriptions);
				}
				if (isManual) {
					showToast(`Fetched subscriptions for ${emailToUse}`, 'success');
				}
			} else {
				if (isManual) {
					showToast(`Backend responded with status ${status || 'error'}`, 'info');
				}
			}
		} catch (err) {
			console.log('GET /api/subscriptions call attempted:', err.message);
			if (isManual) {
				showToast(`GET /api/subscriptions attempted for ${userEmail}`, 'info');
			}
		} finally {
			setIsFetching(false);
		}
	};

	useEffect(() => {
		fetchSubscriptions(false);
	}, [userEmail]);

	// Filter subscriptions based on search query and category
	const filteredSubscriptions = subscriptions.filter(s => {
		const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
		                      (s.category && s.category.toLowerCase().includes(searchQuery.toLowerCase()));
		const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	const categories = ['All', ...new Set(subscriptions.map(s => s.category).filter(Boolean))];

	// Toggle helper for easy testing of empty state vs active state
	const handleClearAll = () => {
		setSubscriptions([]);
		showToast('Cleared subscriptions — viewing Empty State page', 'info');
	};

	return (
		<div className="page active">
			{/* Page Header */}
			<div className="section-head" style={{ marginTop: '6px' }}>
				<div>
					<h2 style={{ fontSize: '20px' }}>Your subscriptions</h2>
					<div className="sub">Everything you're paying for, in one place.</div>
				</div>
				<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
					{subscriptions.length > 0 && (
						<button 
							className="btn btn-ghost" 
							style={{ fontSize: '12px', padding: '6px 12px' }}
							onClick={handleClearAll}
							title="View empty state UI page"
						>
							Simulate 0 Subscriptions
						</button>
					)}
					<button className="btn btn-primary" onClick={() => setAddModalOpen(true)}>
						+ Add subscription
					</button>
				</div>
			</div>

			{/* Render Empty State if no subscriptions are found */}
			{subscriptions.length === 0 ? (
				<EmptySubscriptions 
					setAddModalOpen={setAddModalOpen} 
					onAddSubscription={onAddSubscription}
					userEmail={userEmail}
					onRefetch={() => fetchSubscriptions(true)}
					isFetching={isFetching}
				/>
			) : (
				<>
					{/* Controls: Search, Filter & Re-fetch */}
					<div className="sub-controls-bar">
						<div className="sub-search-input">
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<circle cx="11" cy="11" r="8" />
								<line x1="21" y1="21" x2="16.65" y2="16.65" />
							</svg>
							<input 
								type="text" 
								placeholder="Search subscriptions by name or category..." 
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
							{searchQuery && (
								<button className="clear-search" onClick={() => setSearchQuery('')}>×</button>
							)}
						</div>

						<div className="category-pills">
							{categories.map(cat => (
								<button 
									key={cat}
									className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
									onClick={() => setSelectedCategory(cat)}
								>
									{cat}
								</button>
							))}
						</div>

						<button 
							className={`btn btn-ghost btn-xs refetch-btn ${isFetching ? 'spinning' : ''}`}
							onClick={() => fetchSubscriptions(true)}
							title="Re-fetch user subscriptions from backend GET API"
						>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M21.5 2v6h-6M2.5 22v-6h6" />
								<path d="M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
							</svg>
							{isFetching ? 'Syncing...' : 'Sync GET'}
						</button>
					</div>

					{/* Subscription Cards Grid */}
					{filteredSubscriptions.length === 0 ? (
						<div className="no-search-results">
							<p>No subscriptions match "{searchQuery}".</p>
							<button className="btn btn-ghost" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>Clear filters</button>
						</div>
					) : (
						<div className="sub-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
							{filteredSubscriptions.map(s => (
								<SubCard key={s.id} s={s} isOpen={expandedCards[s.id]} toggleCard={toggleCard} />
							))}
						</div>
					)}
				</>
			)}
		</div>
	);
}
