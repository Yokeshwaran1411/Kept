import React from 'react';

const METHOD_ICON = {
    UPI:  { icon: '📲', label: 'UPI',  color: '#7c6af7' },
    Card: { icon: '💳', label: 'Card', color: '#3ddc97' },
    Cash: { icon: '💵', label: 'Cash', color: '#e5a95f' },
};

function PaymentBadge({ method, method_details }) {
    if (!method) return <span style={{ color: 'var(--text-faint)', fontSize: '13px' }}>Not set</span>;
    const meta = METHOD_ICON[method] || { icon: '💰', label: method, color: 'var(--text-muted)' };
    const detail = !method_details ? null
        : method === 'Card' ? `•••• ${method_details.replace(/\D/g, '').slice(-4)}`
        : method_details;
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                background: `${meta.color}18`, color: meta.color,
                border: `1px solid ${meta.color}40`,
                borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: 500,
            }}>
                <span>{meta.icon}</span><span>{meta.label}</span>
            </span>
            {detail && <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'monospace' }}>{detail}</span>}
        </span>
    );
}

function RenewalBadge({ renewal_date }) {
    if (!renewal_date) return <span style={{ color: 'var(--text-faint)' }}>—</span>;
    const date = new Date(renewal_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((date - today) / 86400000);
    const label = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const urgentColor = diffDays <= 3 ? 'var(--danger)' : diffDays <= 7 ? '#e5a95f' : 'var(--accent)';
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--text)' }}>{label}</span>
            {diffDays >= 0 && (
                <span style={{ fontSize: '11px', color: urgentColor, fontWeight: 600 }}>
                    {diffDays === 0 ? 'Today!' : `in ${diffDays}d`}
                </span>
            )}
        </span>
    );
}

export default function SubCard({ s, isOpen, toggleCard, onEdit, onDelete }) {
    const amount   = Number(s.amount || s.duration || s.price || 0);
    const plan     = s.plan || 'Standard';
    const status   = s.status || 'Active';
    const category = s.type || s.category || '—';
    const started  = s.created_at
        ? new Date(s.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        : (s.started || '—');

    const renewal_date = s.renewal_date || null;
    const daysLeft = renewal_date ? Math.ceil((new Date(renewal_date) - new Date().setHours(0,0,0,0)) / 86400000) : null;
    const soon = daysLeft !== null && daysLeft <= 3;

    return (
        <div className={`card sub-card ${isOpen ? 'open' : ''}`} onClick={() => toggleCard(s.id)}>
            <div className="sub-top">
                <div className="sub-name"><span className="dot"></span>{s.name}</div>
                <span className={`status-pill ${soon ? 'soon' : ''}`}>{status}</span>
            </div>
            <div className="sub-plan">{plan}</div>
            <div className="sub-price mono">
                ₹{amount.toLocaleString('en-IN')}
                <span style={{ fontSize: '12px', color: 'var(--text-faint)', fontWeight: 400 }}> / month</span>
            </div>
            <div className="sub-renew">
                {daysLeft === null ? 'No renewal date set'
                    : daysLeft === 0 ? 'Renewing today!'
                    : daysLeft < 0   ? 'Expired'
                    : `Renews in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`}
            </div>
            <div className="view-link">View details</div>
            <div className="sub-details">
                <div className="row"><span>Payment</span><PaymentBadge method={s.method} method_details={s.method_details} /></div>
                <div className="row"><span>Renews on</span><RenewalBadge renewal_date={renewal_date} /></div>
                <div className="row"><span>Added on</span><span>{started}</span></div>
                <div className="row"><span>Category</span><span>{category}</span></div>
                <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
                    <button
                        className="btn btn-ghost"
                        style={{ flex: 1, padding: '7px', fontSize: '12.5px' }}
                        onClick={(e) => { e.stopPropagation(); if (onEdit) onEdit(s); }}
                    >✏️ Edit</button>
                    <button
                        className="btn btn-danger"
                        style={{ flex: 1, padding: '7px', fontSize: '12.5px' }}
                        onClick={(e) => { e.stopPropagation(); if (onDelete) onDelete(s); }}
                    >🗑️ Delete</button>
                </div>
            </div>
        </div>
    );
}
