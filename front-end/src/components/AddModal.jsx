import React, { useState, useEffect } from 'react';
import './AddModal.css';

const SELECT_STYLE = {
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    background: 'var(--surface-2)', border: '1px solid var(--border)',
    color: 'var(--text)', outline: 'none', fontSize: '14px',
    appearance: 'none', cursor: 'pointer',
};

export default function AddModal({ addModalOpen, setAddModalOpen, showToast, onAdd, editData, onEditDone, onAddSubscription }) {
    const isEdit = Boolean(editData);

    const [name,          setName]          = useState('');
    const [amount,        setAmount]        = useState('');
    const [price,         setPrice]         = useState('');
    const [type,          setType]          = useState('');
    const [renewalDate,   setRenewalDate]   = useState('');
    const [renewIn,       setRenewIn]       = useState('14');
    const [category,      setCategory]      = useState('Entertainment');
    const [plan,          setPlan]          = useState('Standard');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentDetails,setPaymentDetails]= useState('');
    const [loading,       setLoading]       = useState(false);
    const [advOpen,       setAdvOpen]       = useState(false);

    // Populate form when editing
    useEffect(() => {
        if (editData) {
            setName(editData.name || '');
            setAmount(editData.amount || '');
            setType(editData.type || editData.category || '');
            setCategory(editData.category || 'Entertainment');
            setPlan(editData.plan || 'Standard');
            setRenewalDate(editData.renewal_date ? editData.renewal_date.slice(0, 10) : '');
            setPaymentMethod(editData.method || '');
            setPaymentDetails(editData.method_details || '');
            setAdvOpen(Boolean(editData.method));
        }
    }, [editData]);

    const reset = () => {
        setName(''); setAmount(''); setPrice(''); setType(''); setRenewalDate('');
        setRenewIn('14'); setCategory('Entertainment'); setPlan('Standard');
        setPaymentMethod(''); setPaymentDetails(''); setAdvOpen(false);
    };

    const handleSubmit = async () => {
        if (!name.trim()) { showToast('Please enter a subscription name.', 'error'); return; }

        setLoading(true);
        try {
            const storedUser = localStorage.getItem('kept_user');
            if (!storedUser) { showToast('User not found.', 'error'); return; }
            const user = JSON.parse(storedUser);

            const payload = {
                ctid: user.id, name, amount: amount || price, type: type || category,
                renewal_date: renewalDate || null,
                method: paymentMethod || null,
                method_details: paymentDetails || null,
            };

            const url    = isEdit ? `http://localhost:3000/api/subscriptions/${editData.id}` : 'http://localhost:3000/api/subscriptions';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

            if (res.ok) {
                showToast(isEdit ? 'Subscription updated!' : "Subscription added!");
                if (!isEdit && onAddSubscription) {
                    const newSub = {
                        id: Date.now(),
                        name: name.trim(),
                        plan: plan || 'Standard',
                        price: Number(amount || price) || 299,
                        renewIn: Number(renewIn) || 14,
                        status: 'Active',
                        category: category || type || 'Entertainment',
                        method: paymentMethod || 'Visa •••• 4214',
                        started: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
                    };
                    onAddSubscription(newSub);
                }
                reset();
                setAddModalOpen(false);
                if (isEdit && onEditDone) onEditDone();
                else if (onAdd) onAdd();
            } else {
                showToast(isEdit ? 'Failed to update.' : 'Failed to add.', 'error');
            }
        } catch (e) {
            console.error(e);
            showToast('An error occurred.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => { reset(); setAddModalOpen(false); if (isEdit && onEditDone) onEditDone(); };

    // Today string for min date
    const today = new Date().toISOString().slice(0, 10);

    return (
        <div className={`overlay ${addModalOpen ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
            <div className="modal">
                <h3>{isEdit ? 'Edit subscription' : 'Add a subscription'}</h3>
                <p className="sub">{isEdit ? 'Update the details below.' : 'Just the basics — you can edit anytime.'}</p>

                {/* Name */}
                <div className="field">
                    <label>Subscription name</label>
                    <input type="text" placeholder="Netflix, Spotify, GitHub…" value={name} onChange={e => setName(e.target.value)} />
                </div>

                {/* Amount */}
                <div className="field">
                    <label>Amount (₹)</label>
                    <div className="input-prefix-wrap">
                        <span className="input-prefix">₹</span>
                        <input
                            type="number" min="0" step="0.01"
                            placeholder="0.00"
                            value={amount || price}
                            onChange={e => { setAmount(e.target.value); setPrice(e.target.value); }}
                            style={{ paddingLeft: '36px' }}
                        />
                    </div>
                </div>

                {/* Renewal date */}
                <div className="field">
                    <label>Renewal date</label>
                    <div className="datepicker-wrap">
                        <span className="datepicker-icon">📅</span>
                        <input
                            type="date"
                            min={today}
                            value={renewalDate}
                            onChange={e => setRenewalDate(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>
                </div>

                {/* Category / type */}
                <div className="field">
                    <label>Category</label>
                    <select style={SELECT_STYLE} value={type || category} onChange={e => { setType(e.target.value); setCategory(e.target.value); }}>
                        <option value="">Select category</option>
                        <option>Entertainment</option>
                        <option>Productivity</option>
                        <option>Development</option>
                        <option>Cloud</option>
                        <option>Health &amp; Fitness</option>
                        <option>Education</option>
                        <option>Finance</option>
                        <option>Other</option>
                    </select>
                </div>

                {/* Advanced */}
                <button className="adv-toggle" onClick={() => setAdvOpen(o => !o)}>
                    {advOpen ? '– Hide payment details' : '+ Add payment details'}
                </button>
                <div className={`adv-fields ${advOpen ? 'open' : ''}`}>
                    <div className="field">
                        <label>Plan / Tier</label>
                        <input type="text" placeholder="Standard / Pro / Premium" value={plan} onChange={e => setPlan(e.target.value)} />
                    </div>
                    <div className="field">
                        <label>Payment method</label>
                        <select style={SELECT_STYLE} value={paymentMethod} onChange={e => { setPaymentMethod(e.target.value); setPaymentDetails(''); }}>
                            <option value="">Select method</option>
                            <option>Cash</option>
                            <option>UPI</option>
                            <option>Card</option>
                        </select>
                    </div>
                    {paymentMethod === 'UPI' && (
                        <div className="field">
                            <label>UPI ID</label>
                            <input type="text" placeholder="user@paytm" value={paymentDetails} onChange={e => setPaymentDetails(e.target.value)} />
                        </div>
                    )}
                    {paymentMethod === 'Card' && (
                        <div className="field">
                            <label>Card last 4 digits</label>
                            <input type="text" maxLength={4} placeholder="4214" value={paymentDetails} onChange={e => setPaymentDetails(e.target.value)} />
                        </div>
                    )}
                    {paymentMethod === 'Cash' && (
                        <div className="field">
                            <label>Paid to / Reference</label>
                            <input type="text" placeholder="e.g. Landlord" value={paymentDetails} onChange={e => setPaymentDetails(e.target.value)} />
                        </div>
                    )}
                </div>

                <div className="modal-actions">
                    <button className="btn btn-ghost" onClick={handleClose} disabled={loading}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? (isEdit ? 'Saving…' : 'Adding…') : (isEdit ? 'Save changes' : 'Add subscription')}
                    </button>
                </div>
            </div>
        </div>
    );
}
