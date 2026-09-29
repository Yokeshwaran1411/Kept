import React, { useState } from 'react';

export default function AddModal({ addModalOpen, setAddModalOpen, showToast, onAddSubscription }) {
	const [name, setName] = useState('');
	const [price, setPrice] = useState('');
	const [renewIn, setRenewIn] = useState('14');
	const [category, setCategory] = useState('Entertainment');
	const [plan, setPlan] = useState('Standard');
	const [method, setMethod] = useState('Visa •••• 4214');
	const [advFieldsOpen, setAdvFieldsOpen] = useState(false);

	const handleAdd = () => {
		if (!name.trim()) {
			showToast('Please enter a subscription name', 'error');
			return;
		}

		const newSub = {
			id: Date.now(),
			name: name.trim(),
			plan: plan || 'Standard',
			price: Number(price) || 299,
			renewIn: Number(renewIn) || 14,
			status: 'Active',
			category: category || 'Entertainment',
			method: method || 'Visa •••• 4214',
			started: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
		};

		if (onAddSubscription) {
			onAddSubscription(newSub);
		}

		setAddModalOpen(false);
		showToast(`"${newSub.name}" added to subscriptions!`, 'success');

		// Reset fields
		setName('');
		setPrice('');
		setRenewIn('14');
	};

	return (
		<div className={`overlay ${addModalOpen ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setAddModalOpen(false); }}>
			<div className="modal">
				<h3>Add a subscription</h3>
				<p className="sub">Just the basics for now — you can fill in more later.</p>
				<div className="field">
					<label>What are you subscribing to?</label>
					<input 
						type="text" 
						placeholder="e.g. Netflix, Spotify, GitHub..." 
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div className="field">
					<label>How much does it cost (₹ / mo)?</label>
					<input 
						type="number" 
						placeholder="₹ 299" 
						value={price}
						onChange={(e) => setPrice(e.target.value)}
					/>
				</div>
				<div className="field">
					<label>Days until renewal?</label>
					<input 
						type="number" 
						placeholder="14"
						value={renewIn}
						onChange={(e) => setRenewIn(e.target.value)}
					/>
				</div>
				<button className="adv-toggle" onClick={() => setAdvFieldsOpen(!advFieldsOpen)}>
					{advFieldsOpen ? '– Hide details' : '+ Add more details'}
				</button>
				<div className={`adv-fields ${advFieldsOpen ? 'open' : ''}`}>
					<div className="field">
						<label>Plan / Tier</label>
						<input 
							type="text" 
							placeholder="Standard / Pro / Premium" 
							value={plan}
							onChange={(e) => setPlan(e.target.value)}
						/>
					</div>
					<div className="field">
						<label>Category</label>
						<input 
							type="text" 
							placeholder="Entertainment / Development / Cloud" 
							value={category}
							onChange={(e) => setCategory(e.target.value)}
						/>
					</div>
					<div className="field">
						<label>Payment method</label>
						<input 
							type="text" 
							placeholder="Visa •••• 4214" 
							value={method}
							onChange={(e) => setMethod(e.target.value)}
						/>
					</div>
				</div>
				<div className="modal-actions">
					<button className="btn btn-ghost" onClick={() => setAddModalOpen(false)}>Cancel</button>
					<button className="btn btn-primary" onClick={handleAdd}>Add subscription</button>
				</div>
			</div>
		</div>
	);
}
